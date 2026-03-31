import json
import os
from pathlib import Path

def setup_napcat_rkey(napcat_config_dir: str):
    """自动为所有 NapCat 配置文件添加 Rkey 配置"""
    config_dir = Path(napcat_config_dir)

    if not config_dir.exists():
        print(f"配置目录不存在: {config_dir}")
        return

    config_files = list(config_dir.glob("napcat_*.json"))

    if not config_files:
        print("未找到 NapCat 配置文件")
        return

    rkey_config = {
        "enable": True,
        "servers": [
            {
                "url": "https://llob.linyuchen.net/rkey",
                "enable": True
            }
        ]
    }

    for config_file in config_files:
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)

            if "rkey" in config:
                print(f"跳过 {config_file.name}: 已有 Rkey 配置")
                continue

            config["rkey"] = rkey_config

            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)

            print(f"✓ 已配置 {config_file.name}")

        except Exception as e:
            print(f"✗ 配置 {config_file.name} 失败: {e}")

if __name__ == "__main__":
    napcat_dir = os.path.join(os.path.dirname(__file__), "..", "napcat", "config")
    setup_napcat_rkey(napcat_dir)
    print("\n配置完成！请重启 NapCat 使配置生效。")
