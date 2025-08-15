from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
import subprocess
import uuid

app = FastAPI()

# Serve frontend files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.post("/generate")
async def generate_video(req: Request):
    data = await req.json()
    prompt = data.get("prompt")
    video_type = data.get("videoType")

    # Just placeholder — here you’d call SDXL / Runway / GPT APIs
    filename = f"{uuid.uuid4()}.mp4"
    filepath = os.path.join("static", filename)

    # Create fake 1s black video for testing
    subprocess.run([
        "ffmpeg", "-f", "lavfi", "-i", "color=c=black:s=1280x720:d=1",
        "-vf", "drawtext=text='FAKE VIDEO':x=(w-text_w)/2:y=(h-text_h)/2:fontsize=50:fontcolor=white",
        filepath
    ])

    return JSONResponse({"video_url": f"/{filename}"})

if __name__ == "__main__":
    os.makedirs("static", exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
