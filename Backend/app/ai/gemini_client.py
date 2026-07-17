from agno.models.google import Gemini
from app.core.settings import settings

def get_gemini_model(temperature: float = 0.5):
    """
    Returns an initialized Agno Gemini model using the API key from settings.
    This acts as a thin wrapper ensuring consistent configuration.
    """
    return Gemini(
        id="gemini-2.5-flash",
        api_key=settings.GEMINI_API_KEY,
        temperature=temperature
    )
