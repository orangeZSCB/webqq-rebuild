"""
WebQQ 登录相关功能
通过监听 NapCat 登录事件来获取二维码
"""
from nonebot import get_bot
from nonebot.adapters.onebot.v11 import Bot
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

# 存储最新的登录状态
login_state = {
    "logged_in": False,
    "user_info": None
}

@router.get("/login/status")
async def get_login_status():
    """获取登录状态"""
    try:
        bot: Bot = get_bot()
        result = await bot.call_api("get_login_info")
        login_state["logged_in"] = True
        login_state["user_info"] = result
        return JSONResponse(content={
            "status": "ok",
            "logged_in": True,
            "data": result
        })
    except Exception as e:
        return JSONResponse(content={
            "status": "error",
            "logged_in": False,
            "message": str(e)
        })
