from pydantic import BaseModel, Field, conlist
from typing import Optional, List
from enum import Enum

# --- 1. Enums for Controllable Parameters ---
# Using Enum improves type hinting and validation
class AspectRatio(str, Enum):
    SQUARE = "1:1"
    LANDSCAPE = "16:9"
    PORTRAIT = "9:16"

class CameraAngle(str, Enum):
    EYE_LEVEL = "eye-level"
    TOP_DOWN = "top-down"
    LOW_ANGLE = "low-angle"
    DUTCH_ANGLE = "dutch-angle"

class LightingStyle(str, Enum):
    STUDIO_SOFT = "studio soft light"
    HARD_RIM = "hard rim light"
    CINEMATIC_DRAMATIC = "dramatic cinematic"
    NATURAL_DAYLIGHT = "natural daylight"

# --- 2. Component Models ---
class Camera(BaseModel):
    angle: CameraAngle = Field(
        CameraAngle.EYE_LEVEL, 
        description="Camera perspective angle."
    )
    fov: str = Field(
        "normal", 
        description="Field of View (e.g., wide-angle, telephoto, normal)."
    )
    aspect_ratio: AspectRatio = Field(
        AspectRatio.SQUARE, 
        description="Output image aspect ratio."
    )

class Lighting(BaseModel):
    style: LightingStyle = Field(
        LightingStyle.STUDIO_SOFT, 
        description="Style and quality of illumination."
    )
    color_temperature: str = Field(
        "neutral", 
        description="Color mood (e.g., warm, cool, neutral, vibrant)."
    )

# --- 3. Master Spec Model ---
class FiboSpec(BaseModel):
    """The master schema for the Visual Spec Compiler input."""
    product_name: str = Field(..., min_length=3, description="The primary subject of the image.")
    scene_description: str = Field(..., min_length=5, description="The setting or context for the image.")
    
    # Controllable Pydantic Models
    camera: Camera
    lighting: Lighting
    
    # Optional List of Hex Colors (conlist adds validation for list size)
    color_palette: Optional[conlist(str, min_length=1, max_length=5)] = Field(
        None, 
        description="List of 1 to 5 primary hex color codes (e.g., #FFFFFF)."
    )
    
    # Metadata for reproducibility
    seed: Optional[int] = Field(None, ge=0, description="Optional seed for deterministic generation.")
    spec_version: str = Field("v1.0", frozen=True, description="Version of this specification schema.")

# --- 4. Request Model (Wraps the spec for API input) ---
class GenerationRequest(BaseModel):
    spec: FiboSpec