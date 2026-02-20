# Super Mario Bros - Browser Edition

A simplified Super Mario Bros game built with HTML5 Canvas and JavaScript.

[中文版](#中文版) | [English](#english)

---

## 中文版

### 简介

这是一个使用 HTML5 Canvas 和 JavaScript 构建的简化版超级马里奥兄弟游戏。游戏包含两个关卡，具有经典的像素风格图形和音效。

### 特性

- **两个关卡** - 难度递增的第二关
- **经典玩法** - 移动、跳跃、踩敌人、收集金币
- **像素艺术风格** - 模仿原版 Super Mario Bros 的视觉效果
- **音效系统** - 使用 Web Audio API 生成的复古音效
- **视差滚动背景** - 多层次背景营造深度感
- **问号砖块** - 从下方顶击可获得金币
- **敌人系统** - 踩扁敌人获得分数

### 操作方法

| 按键 | 功能 |
|------|------|
| ← → 或 A D | 左右移动 |
| 空格 或 ↑ 或 W | 跳跃 |
| R | 重新开始游戏 |
| M | 开关音效 |

### 游戏机制

- **金币收集** - 每枚金币 100 分
- **踩敌人** - 每个敌人 200 分
- **通关奖励** - 每关 1000 分
- **生命系统** - 3 条命，被碰到或掉落会失去一条命
- **问号砖块** - 从下方顶击可获得金币（100 分）

### 关卡信息

**第一关 (WORLD 1-1)**
- 长度：3200 像素
- 10 个敌人
- 适合新手

**第二关 (WORLD 1-2)**
- 长度：4000 像素
- 18 个更快的敌人
- 4 个坑洞（掉落即死）
- 更高更分散的平台
- 更少的金币

### 技术栈

- HTML5 Canvas
- 原生 JavaScript (无框架)
- Web Audio API
- CSS3

### 如何运行

1. 直接在浏览器中打开 `index.html`
2. 或使用本地服务器：
   ```bash
   python -m http.server 8000
   ```
3. 在浏览器访问 `http://localhost:8000`

### 文件结构

```
mario/
├── index.html      # 游戏主页面
├── mario.js        # 游戏逻辑
└── README.md       # 本文件
```

### 开发说明

- 所有图形使用 Canvas API 实时绘制
- 音效使用 Web Audio API 程序化生成
- 无外部依赖，单个 HTML 文件即可运行

---

## English

### Introduction

A simplified Super Mario Bros game built with HTML5 Canvas and JavaScript. The game features two levels with classic pixel-art style graphics and sound effects.

### Features

- **Two Levels** - Level 2 with increased difficulty
- **Classic Gameplay** - Move, jump, stomp enemies, collect coins
- **Pixel Art Style** - Visuals inspired by the original Super Mario Bros
- **Sound System** - Retro sound effects generated with Web Audio API
- **Parallax Scrolling** - Multi-layered background for depth
- **Question Blocks** - Hit from below to get coins
- **Enemy System** - Stomp enemies to earn points

### Controls

| Key | Action |
|-----|--------|
| ← → or A D | Move left/right |
| Space or ↑ or W | Jump |
| R | Restart game |
| M | Toggle sound |

### Game Mechanics

- **Coin Collection** - 100 points per coin
- **Stomp Enemies** - 200 points per enemy
- **Level Clear** - 1000 points per level
- **Lives System** - 3 lives, lose one when hit or falling
- **Question Blocks** - Hit from below for coins (100 points)

### Level Information

**Level 1 (WORLD 1-1)**
- Length: 3200 pixels
- 10 enemies
- Beginner friendly

**Level 2 (WORLD 1-2)**
- Length: 4000 pixels
- 18 faster enemies
- 4 pits (instant death)
- Higher and more scattered platforms
- Fewer coins

### Tech Stack

- HTML5 Canvas
- Vanilla JavaScript (no frameworks)
- Web Audio API
- CSS3

### How to Run

1. Simply open `index.html` in your browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000` in your browser

### File Structure

```
mario/
├── index.html      # Game main page
├── mario.js        # Game logic
└── README.md       # This file
```

### Development Notes

- All graphics are rendered in real-time using Canvas API
- Sound effects are procedurally generated using Web Audio API
- No external dependencies, runs from a single HTML file

---

## License

This is a fan-made project for educational purposes only. Super Mario Bros is a trademark of Nintendo.
