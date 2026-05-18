# 🔭 portscout

[![CI](https://github.com/YOUR_USERNAME/portscout/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/portscout/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/YOUR_USERNAME/portscout)](https://github.com/YOUR_USERNAME/portscout/releases)

> A lightweight CLI tool that scans for open ports on a local network host.

## ✨ Features

- Scan any host for open TCP ports
- Specify custom port ranges (e.g. `1-1024`, `8000-9000`)
- Well-known service labels (HTTP, SSH, FTP, etc.)
- JSON output for scripting and automation
- Fast concurrent scanning

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/portscout.git
cd portscout

node src/scanner.js scan localhost
node src/scanner.js scan 192.168.1.1 --range 1-1024
node src/scanner.js scan localhost --range 3000-9000
node src/scanner.js report --format json
```

## 📋 Commands

| Command | Description |
|---------|-------------|
| `scan <host>` | Scan common ports on a host |
| `scan <host> --range <start-end>` | Scan a custom port range |
| `report --format json` | Output last scan as JSON |

## 🏆 GitHub Achievement Scripts

```bash
bash scripts/setup.sh
bash scripts/unlock-all.sh
bash scripts/quickdraw.sh
bash scripts/yolo.sh
bash scripts/publicist.sh
bash scripts/pull-shark.sh 2
bash scripts/pair-extraordinaire.sh "Name" "email@example.com"
```

## 📄 License

MIT © YOUR_USERNAME
