# webqq-rebuild
QQ Web 2.0 2010 Rebuild

---

[中文](https://github.com/orangeZSCB/webqq-rebuild/blob/main/README_zh.md) English

## Disclaimer

WebQQ was a browser-based instant messaging service launched by Tencent in 2009 and officially ceased operation in 2019.

The copyright of the original interface design, interaction logic, and related visual materials belongs to Shenzhen Tencent Computer Systems Co., Ltd.

The interface layout used in this project is referenced from the Wayback Machine archive page and is for learning and research purposes only. It does not contain any original code or protected materials from Tencent.

This project is for learning and communication purposes only and may not be used for commercial purposes.

Please delete it within 24 hours after downloading it.

## Introduction

This is a rebuild of QQ Web 2.0 2010, running well with Vite, Vue.js, Python, and something.

Project used [NapCatQQ], [Nonebot] for contact between the project and QQNT. The napcat folder of this repository may not be the newest version, and DO NOT DELETE napcat\qrcode_server.py when you're updating, coz this is a IMPORTANT FILE. The original framework used in this project is unrelated to this project.

## Requirements

It needs you to install [Node.js (with NPM, nvm is not recommended)](https://nodejs.org), [Python](https://python.org).

It will check the environment first when running `start-webqq.bat` every time.

## Deploy

```
git clone https://github.com/orangeZSCB/webqq-rebuild.git
cd webqq-rebuild
npm install
.\start-webqq.bat
```

## Copyrights

Original by Tencent, Rebuild by Orange with ❤.
