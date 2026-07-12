from sqlalchemy.ext.asyncio import AsyncSession
from app.core.settings import settings
import urllib.request
import json
from . import repository, schemas, models
from fastapi import HTTPException
import uuid

async def generate_upload_url() -> schemas.UploadURLResponse:
    fake_id = str(uuid.uuid4())
    return schemas.UploadURLResponse(
        upload_url=f"https://dummy.supabase.co/storage/v1/object/plant-images/{fake_id}.jpg?token=dummy",
        public_url=f"https://dummy.supabase.co/storage/v1/object/public/plant-images/{fake_id}.jpg"
    )

async def process_detection(db: AsyncSession, detection_data: schemas.DetectionCreate) -> models.Detection:
    image_data = detection_data.image_url
    base64_img = ""
    mime_type = "image/jpeg"
    if image_data.startswith("data:image"):
        # e.g., data:image/png;base64,iVBORw...
        header, b64 = image_data.split("base64,")
        base64_img = b64
        mime_type = header.replace("data:", "").replace(";", "")

    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set in backend .env file.")
        
    if not base64_img:
        if "unsplash.com" in image_data:
            raise HTTPException(status_code=400, detail="Please upload a real photo. The default image cannot be analyzed.")
        raise HTTPException(status_code=400, detail="Invalid image format. Expected a base64 uploaded image.")

    disease_name = "Unknown"
    confidence = 0.0
    treatment_text = "No treatment available."
    weather_snapshot = "Clear, 32°C"

    try:
        url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}'
        headers = {'Content-Type': 'application/json'}
        
        prompt = (
            "You are an expert plant pathologist. Analyze this plant image and identify any diseases. "
            "Return ONLY a valid JSON object with exactly these three keys: "
            "'disease_name' (string, e.g., 'Powdery Mildew', or 'Healthy' if no disease), "
            "'confidence_score' (number between 0 and 100 representing your confidence), "
            "and 'treatment_recommendation' (string with a short paragraph of advice)."
        )
        
        data = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inlineData": {"mimeType": mime_type, "data": base64_img}}
                ]
            }],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=15) as response:
            result = json.loads(response.read().decode('utf-8'))
            text_response = result['candidates'][0]['content']['parts'][0]['text']
            
            # Parse the JSON from Gemini
            parsed = json.loads(text_response)
            disease_name = parsed.get("disease_name", "Unknown Disease")
            confidence = float(parsed.get("confidence_score", 0.0))
            
            # Pass the disease to the Orchestrator Team
            from app.ai.agents import agent_team
            if disease_name != "Healthy" and disease_name != "Unknown Disease":
                # Assuming indoor for now, since we don't have the plant's actual location here yet
                prompt_to_team = f"The plant has been diagnosed with '{disease_name}'. Environment: Indoor. Please generate a full report."
                team_response = agent_team.run(prompt_to_team)
                treatment_text = team_response.content
            else:
                treatment_text = parsed.get("treatment_recommendation", "Your plant looks healthy or the disease is unknown.")

            
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"Gemini API HTTPError: {e.code} - {error_msg}")
        raise HTTPException(status_code=500, detail=f"Gemini API error {e.code}: {error_msg}")
    except Exception as e:
        print("Gemini API error:", e)
        raise HTTPException(status_code=500, detail=f"Failed to connect to Gemini API: {str(e)}")

    db_data = {
        "plant_id": detection_data.plant_id,
        "image_url": "scanned_image_via_gemini",
        "disease_name": disease_name,
        "confidence": confidence,
        "treatment_text": treatment_text,
        "weather_snapshot": weather_snapshot
    }

    return await repository.create_detection(db, db_data)
