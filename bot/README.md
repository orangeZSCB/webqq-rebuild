# WebQQ Bot

基于 NoneBot2 的 WebQQ 后端服务

## 安装

```bash
cd bot
pip install -r requirements.txt
```

## 配置

编辑 `.env` 文件：

```ini
# NoneBot2 监听地址
HOST=0.0.0.0
PORT=8080

# OneBot Token（与 NapCatQQ 保持一致）
ONEBOT_ACCESS_TOKEN=
```

## 运行

```bash
python bot.py
```

## 架构

```
QQ Server ↔ NapCatQQ ↔ OneBot v11 ↔ NoneBot2 ↔ WebSocket ↔ WebQQ UI
```

## WebSocket 接口

前端连接: `ws://localhost:8080/webqq/ws`

发送消息格式:
```json
{
  "action": "send_msg",
  "message_type": "private",
  "user_id": 123456,
  "message": "Hello"
}
```
