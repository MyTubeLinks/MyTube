# server.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTask
import yt_dlp
from urllib.parse import quote
import tempfile
import os
import shutil
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/info")
def get_info(url: str = Query(...)):
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = []
            for f in info.get('formats', []):
                resolution = f.get('height', 'audio') if f.get('height') else 'audio'
                if resolution != 'audio':
                    resolution = f"{resolution}p"
                formats.append({
                    "itag": f.get('format_id'),
                    "resolution": resolution,
                    "mime_type": f.get('ext', 'unknown'),
                    "subtype": f.get('ext', 'unknown'),
                    "type": 'audio' if f.get('vcodec') == 'none' else 'video',
                })
            return {"title": info['title'], "thumbnail": info['thumbnail'], "formats": formats}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/download")
def download(url: str = Query(...), itag: str = Query(...), output_format: str = Query(None)):
    temp_dir = None
    try:
        temp_dir = tempfile.mkdtemp()
        output_template = os.path.join(temp_dir, 'download.%(ext)s')
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'outtmpl': output_template,
            'continuedl': True,
            'nopart': True,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if output_format == 'mp3':
                ydl_opts['format'] = 'bestaudio'
                ydl_opts['postprocessors'] = [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }]
                file_ext = 'mp3'
                media_type = 'audio/mpeg'
            else:
                ydl_opts['format'] = itag
                file_ext = next((f['ext'] for f in info['formats'] if f['format_id'] == itag), 'mp4')
                format_selected = next((f for f in info['formats'] if f['format_id'] == itag), None)
                if format_selected and format_selected.get('vcodec') == 'none':
                    media_type = 'audio/' + file_ext
                else:
                    media_type = 'video/' + file_ext

            ydl.download([url])

            downloaded_files = [f for f in os.listdir(temp_dir) if not f.endswith('.part')]
            if not downloaded_files:
                raise ValueError("No file downloaded")

            actual_path = os.path.join(temp_dir, downloaded_files[0])

            if not os.path.exists(actual_path):
                raise HTTPException(status_code=500, detail="Downloaded file does not exist")

        filename = f"{info['title']}.{file_ext}".replace(" ", "_")
        filename_encoded = quote(filename.encode('utf-8'))
        headers = {"Content-Disposition": f"attachment; filename*=UTF-8''{filename_encoded}"}

        def cleanup():
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)

        return FileResponse(actual_path, media_type=media_type, headers=headers, background=BackgroundTask(cleanup))
    except Exception as e:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        raise HTTPException(status_code=400, detail=str(e))

app.mount("/", StaticFiles(directory=".", html=True), name="static")