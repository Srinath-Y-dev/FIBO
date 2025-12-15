from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from google import genai
from google.genai import types
from google.genai.errors import APIError
from pydantic_core import PydanticOmit
from app.core.config import settings
from app.models.spec import FiboSpec # Import your existing FiboSpec
from typing import Any, Dict

router = APIRouter()

# --- 1. Agent Request and Response Models ---
class AgentPatchRequest(BaseModel):
    """Input model for the agent endpoint."""
    current_spec: FiboSpec
    instruction: str = Field(..., description="Natural language instruction for modification (e.g., 'make the lighting more dramatic').")

# The LLM will return a *modified* FiboSpec. We use FiboSpec as the output model.
# Since we want to ensure the LLM returns *only* the new spec, the response is FiboSpec.
class AgentPatchResponse(BaseModel):
    """Output model containing the proposed new spec."""
    new_spec: FiboSpec
    patch_summary: str = Field(..., description="A one-sentence summary of the changes made to the spec.")

# --- 2. Initialize Gemini Client ---
try:
    gemini_client = genai.Client(api_key=settings.LLM_API_KEY)
except ValueError:
    print("Warning: LLM_API_KEY not found or invalid. Agent endpoint will be mocked.")
    gemini_client = None

# --- 3. The LLM Call Logic ---
@router.post(
    "/propose-patch", 
    response_model=AgentPatchResponse, 
    summary="Generate a modified FiboSpec from natural language instructions"
)
async def propose_spec_patch(request: AgentPatchRequest) -> AgentPatchResponse:
    """
    Uses an LLM (Gemini) to convert a natural language instruction into 
    a valid, modified FiboSpec JSON object.
    """
    
    current_spec_json = request.current_spec.model_dump_json(indent=2)
    
    # 1. Construct the System Instruction and User Prompt
    system_instruction = (
        "You are an expert Creative Director Agent. Your task is to intelligently modify a "
        "Visual Specification JSON based on a natural language instruction. You MUST "
        "return the COMPLETE, MODIFIED JSON object that strictly adheres to the provided schema. "
        "DO NOT invent new fields or return anything other than the final JSON object and a summary."
        "The Pydantic schema for the output is: "
    )
    
    user_prompt = (
        f"The CURRENT Visual Spec is:\n\n---\n{current_spec_json}\n---\n\n"
        f"Your creative instruction is: **{request.instruction}**"
        f"\n\nProduce the complete, updated FiboSpec and a patch summary."
    )

    if not gemini_client:
        # --- HACKATHON MOCK FOR AGENT (if API key is missing) ---
        print("MOCKING AGENT API CALL...")
        # Mocking the change to dramatic lighting
        mock_spec = request.current_spec.model_copy(deep=True)
        if mock_spec.lighting.style.value != "dramatic cinematic":
            mock_spec.lighting.style = 'dramatic cinematic'
            mock_summary = "Mock: The lighting style was changed to dramatic cinematic."
        else:
             mock_summary = "Mock: No changes were needed based on the instruction."
        
        return AgentPatchResponse(new_spec=mock_spec, patch_summary=mock_summary)
        
    # 2. Call the Gemini API with Structured Output
    try:
        response = gemini_client.models.generate_content(
            model=settings.LLM_MODEL,
            contents=[user_prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                # Use Pydantic's JSON Schema to force structured output
                response_mime_type="application/json",
                response_schema=AgentPatchResponse.model_json_schema() # Use the response model's schema
            )
        )
        
        # 3. Parse and Validate Output
        # The API guarantees JSON, but we use Pydantic again for safety and conversion
        llm_output = AgentPatchResponse.model_validate_json(response.text)
        
        return llm_output
    
    except APIError as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM Agent service is temporarily unavailable or returned a structured error."
        )
    except Exception as e:
        print(f"Agent Processing Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during agent processing."
        )