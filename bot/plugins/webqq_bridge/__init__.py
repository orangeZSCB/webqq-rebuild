from nonebot import get_driver, on_message, get_app
from nonebot.adapters.onebot.v11 import Bot, MessageEvent
from fastapi import WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import Set
import json

driver = get_driver()
websocket_clients: Set[WebSocket] = set()

from . import websocket
from .login import router as login_router
from .media import router as media_router

# 注册路由
app = get_app()
app.include_router(login_router, prefix="/api")
app.include_router(media_router, prefix="")

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

message_handler = on_message(priority=1, block=False)

@message_handler.handle()
async def forward_to_webqq(bot: Bot, event: MessageEvent):
    """转发消息到 WebQQ UI"""
    print(f"[WebQQ] Received message, forwarding to {len(websocket_clients)} clients")

    # 解析消息内容，支持文本、图片、语音、文件等
    message_content = []
    for seg in event.message:
        if seg.type == "text":
            message_content.append({"type": "text", "text": seg.data.get("text", "")})
        elif seg.type == "image":
            message_content.append({"type": "image", "url": seg.data.get("url", "")})
        elif seg.type == "record":
            message_content.append({"type": "record", "url": seg.data.get("url", "")})
        elif seg.type == "file":
            message_content.append({"type": "file", "url": seg.data.get("url", ""), "name": seg.data.get("name", "")})
        elif seg.type == "at":
            message_content.append({"type": "at", "qq": seg.data.get("qq", "")})
        elif seg.type == "reply":
            message_content.append({"type": "reply", "id": seg.data.get("id", "")})

    # 构建增强的 raw_message：将 at 的 QQ 号替换为昵称，将 reply 补充原消息文本
    enhanced_message = event.raw_message

    # 处理 at 段：获取被 @ 用户的昵称
    for seg in event.message:
        if seg.type == "at":
            qq = seg.data.get("qq", "")
            if qq:
                try:
                    if event.message_type == "group":
                        member_info = await bot.get_group_member_info(
                            group_id=event.group_id, user_id=int(qq)
                        )
                        name = member_info.get("card") or member_info.get("nickname") or f"用户{qq}"
                    else:
                        stranger_info = await bot.get_stranger_info(user_id=int(qq))
                        name = stranger_info.get("nickname") or f"用户{qq}"
                    # 替换 CQ:at 为带昵称的格式
                    enhanced_message = enhanced_message.replace(
                        f"[CQ:at,qq={qq}]",
                        f"[CQ:at,qq={qq},name={name}]"
                    )
                except Exception as e:
                    print(f"[WebQQ] Failed to get name for qq={qq}: {e}")

    # 处理 reply 段：获取被回复消息的文本
    for seg in event.message:
        if seg.type == "reply":
            reply_id = seg.data.get("id", "")
            if reply_id:
                try:
                    reply_msg = await bot.get_msg(message_id=int(reply_id))
                    reply_text = reply_msg.get("raw_message", "") or reply_msg.get("message", "")
                    # 截取前50个字符
                    if len(reply_text) > 50:
                        reply_text = reply_text[:50] + "..."
                    enhanced_message = enhanced_message.replace(
                        f"[CQ:reply,id={reply_id}]",
                        f"[CQ:reply,id={reply_id},text={reply_text}]"
                    )
                except Exception as e:
                    print(f"[WebQQ] Failed to get reply message id={reply_id}: {e}")

    data = {
        "type": "message",
        "post_type": "message",
        "message_type": event.message_type,
        "user_id": event.user_id,
        "message": enhanced_message,
        "message_content": message_content,
        "message_id": event.message_id,
        "time": event.time,
        "sender": {
            "user_id": event.sender.user_id,
            "nickname": event.sender.nickname,
        }
    }

    if event.message_type == "group":
        data["group_id"] = event.group_id

    for client in websocket_clients.copy():
        try:
            await client.send_json(data)
            print(f"[WebQQ] Message sent to client")
        except Exception as e:
            print(f"[WebQQ] Failed to send to client: {e}")
            websocket_clients.discard(client)
