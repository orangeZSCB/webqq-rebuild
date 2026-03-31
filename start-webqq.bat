@echo off
chcp 65001 >nul
setlocal

:: ============================================================
:: 环境检测
:: ============================================================
echo [检测] 正在检查运行环境...

call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 npm，bro 需要去 https://nodejs.org 下载一份。
    pause
    exit /b 1
) else (
    for /f "delims=" %%v in ('call npm --version 2^>nul') do echo [OK] npm 版本: %%v
)

call python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Python，bro 需要去 https://python.org 下一个，建议下载 python 3.9 以前 3.6 以后的版本。
    pause
    exit /b 1
) else (
    for /f "delims=" %%v in ('call python --version 2^>nul') do echo [OK] %%v
)

echo.

:: ============================================================
:: 主体：启动服务
:: ============================================================
start npm run dev
cd napcat
start .\launcher.bat
start python qrcode_server.py
cd ../
cd bot
start python bot.py
cd ../
echo 所有系统全部启动启动启动启动启动！还有这个！乐迪！！！
timeout /t 10 /nobreak
cls
echo 欢迎来到 QQ Web 2.0 2010 现代重构版！
echo 请使用 localhost:5173 (大多数时候是这样子的) 访问 QQ Web 2.0 2010！
echo.
echo 再次点击任意按键，我们将会进行进程清除。
pause

:: ============================================================
:: 清理工作
:: ============================================================
echo 再次点击任意按键，我们将会清除所有 QQ Web 2.0 2010 重构版的有关进程！
pause
echo.
echo 请再次点击任意按键！
pause
echo.
cls
echo [清理] 正在关闭所有相关进程...

:: --- 按窗口标题杀 ---
echo [清理] 终止窗口进程...
taskkill /FI "WINDOWTITLE eq NapCat*"     /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq QRCode-Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq NoneBot*"      /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq WebQQ-Fronte*" /F >nul 2>&1

:: --- 按进程名杀 ---
echo [清理] 终止 NapCat / QQ 进程...
taskkill /IM "QQ.exe"                /F >nul 2>&1
taskkill /IM "napcat.exe"            /F >nul 2>&1
taskkill /IM "NapCatWinBootMain.exe" /F >nul 2>&1

:: --- 按端口兜底杀 ---
echo [清理] 释放占用端口...
for %%p in (8080 5173 19114) do (
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":%%p " 2^>nul') do (
        if not "%%i"=="" (
            echo [清理] 端口 %%p → PID %%i
            taskkill /PID %%i /F >nul 2>&1
        )
    )
)

echo.
echo [完成] 清理完毕，乐迪拜拜！
echo.
echo 理论上还会有控制台残留，请你手动清除！
pause