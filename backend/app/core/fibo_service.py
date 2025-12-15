import json
import requests
from app.core.config import settings
from app.models.spec import FiboSpec
from typing import Dict, Any

class FiboService:
    """Handles communication and payload construction for the FIBO API."""
    
    def __init__(self):
        self.base_url = settings.FIBO_BASE_URL
        self.headers = {
            "Authorization": f"Bearer {settings.FIBO_API_KEY}",
            "Content-Type": "application/json"
        }
    
    def _transform_spec_to_fibo_payload(self, spec: FiboSpec) -> Dict[str, Any]:
        """
        Transforms the internal FiboSpec Pydantic object into the 
        specific external JSON payload required by the Bria V2 /text-to-image endpoint.
        """
        # --- CRITICAL: Customize this payload based on actual Bria/FIBO V2 documentation ---
        # The key is to map your structured fields (camera, lighting, color_palette) 
        # into the expected nested JSON structure, proving "JSON-Native" use.
        
        # Example mapping (highly conceptual, adjust based on Bria docs):
        payload = {
            # Core Prompt
            "prompt": f"{spec.product_name}, {spec.scene_description}",
            "negative_prompt": "blurry, low quality, noise, artifacts",
            
            # Controllability Parameters (JSON-Native)
            "controllability_params": {
                "camera_angle": spec.camera.angle.value, # Use .value for Enum
                "fov_type": spec.camera.fov,
                "lighting_style": spec.lighting.style.value,
                "color_scheme": spec.color_palette or [], 
                # ... and other FIBO-specific controls
            },
            
            # Output Settings
            "output_settings": {
                "aspect_ratio": spec.camera.aspect_ratio.value,
                "bit_depth": "8bit" # Or 16bit if supported and needed
            },
            
            # Seed (for reproducibility)
            "seed": spec.seed if spec.seed is not None else -1
        }
        
        return payload

    def generate_image(self, spec: FiboSpec) -> Dict[str, Any]:
        """
        Validates, transforms, calls the FIBO API, and returns the result (image URL/data).
        
        NOTE: In a real implementation, you'd handle image data (Base64 or URL) and 
        upload it to storage here, then return the public storage URL. 
        For the MVP, we mock the output.
        """
        fibo_payload = self._transform_spec_to_fibo_payload(spec)
        
        # --- HACKATHON MOCK START ---
        if settings.FIBO_API_KEY == "mock_key":
            import uuid
            print("MOCKING FIBO API CALL...")
            return {
                "success": True,
                "image_data_url": f"https://mockstorage.dev/images/{uuid.uuid4()}.jpg",
                "internal_id": str(uuid.uuid4())
            }
        # --- HACKATHON MOCK END ---
        
        # Actual API Call (Uncomment and implement fully once ready to test with Bria)
        # try:
        #     response = requests.post(f"{self.base_url}/text-to-image", 
        #                              headers=self.headers, 
        #                              json=fibo_payload)
        #     response.raise_for_status() # Raise exception for bad status codes
        #     return response.json()
        # except requests.RequestException as e:
        #     raise Exception(f"FIBO API request failed: {e}")

# Instantiate the service for use in routes
fibo_service = FiboService()