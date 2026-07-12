from pydantic import BaseModel

class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    condition: str
    is_cached: bool
    
    class Config:
        from_attributes = True
