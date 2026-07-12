import urllib.request
import json
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from . import repository, schemas

def wmo_code_to_string(code: int) -> str:
    # WMO Weather interpretation codes
    if code == 0: return "Clear sky"
    if code in [1, 2, 3]: return "Mainly clear, partly cloudy, and overcast"
    if code in [45, 48]: return "Fog and depositing rime fog"
    if code in [51, 53, 55]: return "Drizzle"
    if code in [56, 57]: return "Freezing Drizzle"
    if code in [61, 63, 65]: return "Rain"
    if code in [66, 67]: return "Freezing Rain"
    if code in [71, 73, 75]: return "Snow fall"
    if code == 77: return "Snow grains"
    if code in [80, 81, 82]: return "Rain showers"
    if code in [85, 86]: return "Snow showers"
    if code == 95: return "Thunderstorm"
    if code in [96, 99]: return "Thunderstorm with slight and heavy hail"
    return "Unknown weather"

async def get_weather_snapshot(db: AsyncSession, lat: float, lng: float) -> schemas.WeatherResponse:
    # 1. Check cache
    cached = await repository.get_valid_weather_cache(db, lat, lng, ttl_hours=1)
    if cached:
        payload = cached.payload
        return schemas.WeatherResponse(
            temperature=payload.get("temperature", 0.0),
            humidity=payload.get("humidity", 0.0),
            condition=payload.get("condition", "Unknown"),
            is_cached=True
        )
    
    # 2. Fetch from Open-Meteo
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,weather_code"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'PlantNest-Backend/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            current = data.get("current", {})
            
            temp = float(current.get("temperature_2m", 0.0))
            humidity = float(current.get("relative_humidity_2m", 0.0))
            code = int(current.get("weather_code", 0))
            condition = wmo_code_to_string(code)
            
            payload = {
                "temperature": temp,
                "humidity": humidity,
                "condition": condition
            }
            
            # Save to cache
            await repository.save_weather_cache(db, lat, lng, payload)
            
            return schemas.WeatherResponse(
                temperature=temp,
                humidity=humidity,
                condition=condition,
                is_cached=False
            )
            
    except Exception as e:
        print(f"Weather fetch failed: {e}")
        # Fallback response
        return schemas.WeatherResponse(
            temperature=20.0,
            humidity=50.0,
            condition="Unable to fetch weather",
            is_cached=False
        )
