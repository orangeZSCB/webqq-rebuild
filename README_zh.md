# webqq-rebuild

QQ Web 2.0 2010 重建版

---

中文 [英文](https://github.com/orangeZSCB/webqq-rebuild/blob/main/README.md)

## 免责声明

WebQQ 是腾讯于 2009 年推出的基于浏览器的即时通讯服务，并于 2019 年正式停止运营。

原始界面设计、交互逻辑及相关视觉素材的版权归深圳市腾讯计算机系统有限公司所有。

本项目使用的界面布局参考了 Wayback Machine 存档页面，仅供学习和研究之用。不包含任何腾讯的原创代码或受保护素材。

本项目仅供学习和交流之用，不得用于商业用途。

请在下载后 24 小时内删除。

## 简介

这是 QQ Web 2.0 2010 的重制版，运行良好，使用 Vite、Vue.js、Python 等框架。

本项目使用 [NapCatQQ](https://napneko.github.io/) 和 [Nonebot](https://nonebot.dev) 进行项目与 QQNT 之间的通信。本仓库中的 napcat 文件夹可能不是最新版本，更新时请勿删除 napcat\qrcode_server.py 文件，因为这是一个重要文件。本项目使用的原始框架与本项目无关。

## 要求

需要安装 [Node.js（使用 NPM，不推荐使用 nvm）](https://nodejs.org) 和 [Python](https://python.org)。

每次运行 `start-webqq.bat` 时，都会先检查环境。

## 部署

```
git clone https://github.com/orangeZSCB/webqq-rebuild.git
cd webqq-rebuild
npm install
.\start-webqq.bat
```

## 版权声明

原版来自腾讯，由 Orange 重制 with ❤。
