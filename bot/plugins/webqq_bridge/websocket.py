from fastapi import WebSocket, WebSocketDisconnect
from nonebot import get_app, get_bot
from nonebot.adapters.onebot.v11 import Bot, Message, MessageSegment
from . import websocket_clients
import json

app = get_app()

@app.websocket("/webqq/ws")
async def webqq_websocket(websocket: WebSocket):
    await websocket.accept()
    websocket_clients.add(websocket)
    print(f"[WebQQ] Client connected, total clients: {len(websocket_clients)}")

    try:
        while True:
            data = await websocket.receive_json()
            print(f"[WebQQ WS] Received data: {data}")

            if data["action"] == "send_msg":
                bot: Bot = get_bot()

                # 构建消息，支持文本、图片、语音、文件
                message = Message()
                msg_content = data.get("message", "")

                if isinstance(msg_content, str):
                    message = Message(msg_content)
                elif isinstance(msg_content, list):
                    for seg in msg_content:
                        if seg["type"] == "text":
                            message += MessageSegment.text(seg["text"])
                        elif seg["type"] == "image":
                            message += MessageSegment.image(seg['url'])
                        elif seg["type"] == "record":
                            message += MessageSegment.record(seg['url'])
                        elif seg["type"] == "file":
                            message += f"[CQ:file,file={seg['url']},name={seg.get('name', 'file')}]"

                await bot.send_msg(
                    message_type=data.get("message_type", "private"),
                    user_id=data.get("user_id"),
                    group_id=data.get("group_id"),
                    message=message
                )
            elif data.get("action"):
                bot: Bot = get_bot()
                action = data["action"]
                params = data.get("params", {})
                echo = data.get("echo")

                try:
                    result = await bot.call_api(action, **params)
                    response = {
                        "status": "ok",
                        "retcode": 0,
                        "data": result,
                        "echo": echo
                    }
                    print(f"[WebQQ WS] Sending response: {response}")
                    await websocket.send_json(response)
                except Exception as e:
                    error_response = {
                        "status": "failed",
                        "retcode": 1,
                        "message": str(e),
                        "echo": echo
                    }
                    print(f"[WebQQ WS] Sending error: {error_response}")
                    await websocket.send_json(error_response)
    except WebSocketDisconnect:
        websocket_clients.discard(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        websocket_clients.discard(websocket)
