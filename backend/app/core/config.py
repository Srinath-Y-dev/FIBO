from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Core Server
    PROJECT_NAME: str = "Visual Spec Compiler"
    
    # FIBO API
    FIBO_API_KEY: str
    FIBO_BASE_URL: str
    
    # Database
    DATABASE_URL: str
    
    # LLM Agent
    LLM_API_KEY: str
    LLM_MODEL: str = "gemini-2.5-flash"

    # Use a nested class to define configuration sources
    class Config:
        env_file = ".env"
        # Enable usage of .env file
        
settings = Settings()