from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, FileResponse
import httpx
import os
import base64

router = APIRouter()

# QQ 图片/视频请求需要的 headers
QQ_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://qun.qq.com/",
}

@router.get("/get_image")
async def get_image(url: str):
    """代理图片请求 - 直接返回 URL，让前端加载"""
    # gchat.qpic.cn 的图片无法通过后端代理（需要特殊认证）
    # 直接返回 URL，让前端通过 img 标签加载
    # 浏览器会自动处理 cookies 和认证
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=QQ_HEADERS, timeout=30.0, follow_redirects=True)
            response.raise_for_status()
            return StreamingResponse(
                iter([response.content]),
                media_type=response.headers.get("content-type", "image/jpeg"),
                headers={
                    "Cache-Control": "public, max-age=31536000",
                    "Access-Control-Allow-Origin": "*",
                }
            )
    except Exception as e:
        print(f"[Media] Image fetch error: {e}")
        # 返回占位图
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_record")
async def get_record(file: str):
    """获取语音文件 - AMR 格式浏览器不支持，直接返回让浏览器尝试"""
    if not os.path.exists(file):
        raise HTTPException(status_code=404, detail="File not found")

    # 返回 AMR 文件，浏览器可能不支持
    return FileResponse(file, media_type="audio/amr")

@router.get("/get_file")
async def get_file(file_id: str):
    """下载文件 - 需要调用 OneBot API"""
    from nonebot import get_bot
    try:
        bot = get_bot()
        result = await bot.call_api("get_file", file_id=file_id)
        file_path = result.get("file")

        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")

        return FileResponse(file_path)
    except Exception as e:
        print(f"[Media] File fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_video")
async def get_video(url: str):
    """代理视频请求"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=QQ_HEADERS, timeout=60.0, follow_redirects=True)
            response.raise_for_status()
            return StreamingResponse(
                iter([response.content]),
                media_type=response.headers.get("content-type", "video/mp4")
            )
    except Exception as e:
        print(f"[Media] Video fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    """上传图片并返回base64编码"""
    try:
        content = await file.read()
        base64_data = base64.b64encode(content).decode('utf-8')
        return {"file": f"base64://{base64_data}"}
    except Exception as e:
        print(f"[Media] Image upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload_file")
async def upload_file(file: UploadFile = File(...)):
    """上传文件到临时目录"""
    try:
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, file.filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        return {"file": os.path.abspath(file_path), "name": file.filename}
    except Exception as e:
        print(f"[Media] File upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
