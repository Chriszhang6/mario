// 获取Canvas和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 音频上下文
let audioCtx = null;
let soundEnabled = true;

// 初始化音频上下文
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 切换音效
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        soundToggle.classList.toggle('muted', !soundEnabled);
    }
}

// 音效系统
const SoundEffects = {
    // 跳跃音效
    jump: () => {
        if (!audioCtx || !soundEnabled) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    },

    // 金币收集音效
    coin: () => {
        if (!audioCtx || !soundEnabled) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(900, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.15);
    },

    // 踩敌人音效
    stomp: () => {
        if (!audioCtx || !soundEnabled) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.15);
    },

    // 受伤音效
    hurt: () => {
        if (!audioCtx || !soundEnabled) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    },

    // 游戏结束音效
    gameOver: () => {
        if (!audioCtx || !soundEnabled) return;
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.2);

            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.2 + 0.2);

            oscillator.start(audioCtx.currentTime + i * 0.2);
            oscillator.stop(audioCtx.currentTime + i * 0.2 + 0.2);
        });
    },

    // 过关音效
    win: () => {
        if (!audioCtx || !soundEnabled) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);

            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.15);

            oscillator.start(audioCtx.currentTime + i * 0.15);
            oscillator.stop(audioCtx.currentTime + i * 0.15 + 0.15);
        });
    },

    // 顶砖块音效
    bump: () => {
        if (!audioCtx || !soundEnabled) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.05);
    }
};

// 游戏状态
let score = 0;
let lives = 3;
let gameOver = false;
let cameraX = 0;
let currentLevel = 1;
let maxLevelReached = 1; // 记录玩家到达的最高关卡

// 按键状态
const keys = {
    left: false,
    right: false,
    jump: false
};

// 马里奥角色
const mario = {
    x: 100,
    y: 300,
    width: 32,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: -15,
    gravity: 0.6,
    grounded: false,
    direction: 1, // 1 = 右, -1 = 左
    frameX: 0,
    frameTimer: 0
};

// 格式化分数显示
function updateScoreDisplay() {
    const scoreStr = score.toString().padStart(6, '0');
    document.getElementById('score').textContent = scoreStr;
}

// 更新世界显示
function updateWorldDisplay() {
    document.getElementById('world').textContent = `1-${currentLevel}`;
}

// 关卡数据
const level = {
    platforms: [],
    coins: [],
    enemies: [],
    flag: null,
    width: 3200,
    poppedCoins: [], // 从砖块弹出的金币
    particles: []    // 粒子效果
};

// 初始化关卡
function initLevel() {
    level.platforms = [];
    level.coins = [];
    level.enemies = [];
    level.poppedCoins = [];
    level.particles = [];

    if (currentLevel === 1) {
        initLevel1();
    } else if (currentLevel === 2) {
        initLevel2();
    } else if (currentLevel === 3) {
        initLevel3();
    }
}

// 第一关
function initLevel1() {
    level.width = 3200;

    // 地面
    for (let i = 0; i < 40; i++) {
        level.platforms.push({
            x: i * 80,
            y: 360,
            width: 80,
            height: 40,
            type: 'ground'
        });
    }

    // 悬浮平台（包含普通砖块和问号砖块）
    const floatingPlatforms = [
        { x: 300, y: 280, width: 120 },
        { x: 500, y: 220, width: 80, hasCoin: true },
        { x: 650, y: 280, width: 100 },
        { x: 850, y: 200, width: 80, hasCoin: true },
        { x: 1000, y: 260, width: 120 },
        { x: 1200, y: 180, width: 80, hasCoin: true },
        { x: 1400, y: 240, width: 150 },
        { x: 1650, y: 280, width: 100, hasCoin: true },
        { x: 1800, y: 200, width: 80 },
        { x: 2000, y: 260, width: 120, hasCoin: true },
        { x: 2200, y: 180, width: 100 },
        { x: 2400, y: 240, width: 80, hasCoin: true },
        { x: 2600, y: 200, width: 120 }
    ];

    floatingPlatforms.forEach(p => {
        level.platforms.push({
            x: p.x,
            y: p.y,
            width: p.width,
            height: 20,
            type: p.hasCoin ? 'question' : 'brick',
            hasCoin: p.hasCoin || false,
            coinCollected: false,
            bounceOffset: 0,
            bounceTime: 0
        });
    });

    // 添加单独的问号砖块
    const questionBricks = [
        { x: 200, y: 280 },
        { x: 450, y: 180 },
        { x: 750, y: 200 },
        { x: 1100, y: 140 },
        { x: 1350, y: 160 },
        { x: 1700, y: 120 },
        { x: 1950, y: 180 },
        { x: 2300, y: 140 },
        { x: 2550, y: 160 }
    ];

    questionBricks.forEach(b => {
        level.platforms.push({
            x: b.x,
            y: b.y,
            width: 40,
            height: 20,
            type: 'question',
            hasCoin: true,
            coinCollected: false,
            bounceOffset: 0,
            bounceTime: 0
        });
    });

    // 金币
    const coinPositions = [
        { x: 200, y: 320 },
        { x: 350, y: 240 },
        { x: 400, y: 240 },
        { x: 540, y: 180 },
        { x: 700, y: 240 },
        { x: 880, y: 160 },
        { x: 1050, y: 220 },
        { x: 1100, y: 220 },
        { x: 1230, y: 140 },
        { x: 1450, y: 200 },
        { x: 1500, y: 200 },
        { x: 1700, y: 240 },
        { x: 1840, y: 160 },
        { x: 2050, y: 220 },
        { x: 2240, y: 140 },
        { x: 2440, y: 200 },
        { x: 2650, y: 160 }
    ];

    coinPositions.forEach(c => {
        level.coins.push({
            x: c.x,
            y: c.y,
            width: 20,
            height: 20,
            collected: false,
            frame: 0
        });
    });

    // 敌人（不同速度和大小）
    const enemyPositions = [
        { x: 400, y: 330, speed: 2 },
        { x: 600, y: 330, speed: 1.5 },
        { x: 900, y: 330, speed: 2.5 },
        { x: 1100, y: 330, speed: 1.8 },
        { x: 1400, y: 330, speed: 2.2 },
        { x: 1700, y: 330, speed: 1.5 },
        { x: 2000, y: 330, speed: 2.8 },
        { x: 2300, y: 330, speed: 2 },
        { x: 2600, y: 330, speed: 2.3 },
        { x: 2900, y: 330, speed: 1.7 }
    ];

    enemyPositions.forEach(e => {
        level.enemies.push({
            x: e.x,
            y: e.y,
            width: 32,
            height: 32,
            velocityX: -Math.random() > 0.5 ? e.speed : -e.speed,
            alive: true,
            frame: 0,
            squish: 0,
            squishTime: 0
        });
    });

    // 更新敌人碰撞检测的y位置（新设计稍高一些）
    level.enemies.forEach(e => {
        e.y = e.y - 2;
    });

    // 终点旗帜
    level.flag = {
        x: 3000,
        y: 160,
        width: 10,
        height: 200
    };
}

// 第二关 - 更高难度
function initLevel2() {
    level.width = 4000;

    // 地面 - 带有坑洞
    for (let i = 0; i < 50; i++) {
        // 在某些位置创建坑洞
        if (i >= 8 && i <= 10) continue;  // 第一个坑
        if (i >= 18 && i <= 20) continue; // 第二个坑
        if (i >= 28 && i <= 31) continue; // 第三个坑
        if (i >= 38 && i <= 41) continue; // 第四个坑

        level.platforms.push({
            x: i * 80,
            y: 360,
            width: 80,
            height: 40,
            type: 'ground'
        });
    }

    // 悬浮平台 - 更高更分散
    const floatingPlatforms = [
        { x: 200, y: 260, width: 100, hasCoin: true },
        { x: 350, y: 200, width: 80 },
        { x: 500, y: 140, width: 60, hasCoin: true },
        { x: 700, y: 280, width: 120 },
        { x: 900, y: 180, width: 80, hasCoin: true },
        { x: 1100, y: 120, width: 60 },
        { x: 1300, y: 260, width: 100 },
        { x: 1500, y: 160, width: 80, hasCoin: true },
        { x: 1700, y: 220, width: 120 },
        { x: 1950, y: 140, width: 60, hasCoin: true },
        { x: 2150, y: 200, width: 80 },
        { x: 2350, y: 120, width: 60, hasCoin: true },
        { x: 2550, y: 260, width: 100 },
        { x: 2750, y: 180, width: 80, hasCoin: true },
        { x: 2950, y: 140, width: 60 },
        { x: 3150, y: 220, width: 120, hasCoin: true },
        { x: 3400, y: 160, width: 80 },
        { x: 3600, y: 200, width: 100, hasCoin: true },
        { x: 3800, y: 140, width: 60 }
    ];

    floatingPlatforms.forEach(p => {
        level.platforms.push({
            x: p.x,
            y: p.y,
            width: p.width,
            height: 20,
            type: p.hasCoin ? 'question' : 'brick',
            hasCoin: p.hasCoin || false,
            coinCollected: false,
            bounceOffset: 0,
            bounceTime: 0
        });
    });

    // 单独的问号砖块 - 更分散
    const questionBricks = [
        { x: 150, y: 180 },
        { x: 280, y: 120 },
        { x: 400, y: 100 },
        { x: 580, y: 140 },
        { x: 750, y: 160 },
        { x: 980, y: 100 },
        { x: 1150, y: 80 },
        { x: 1350, y: 180 },
        { x: 1580, y: 120 },
        { x: 1800, y: 160 },
        { x: 2000, y: 100 },
        { x: 2200, y: 140 },
        { x: 2420, y: 80 },
        { x: 2650, y: 200 },
        { x: 2850, y: 120 },
        { x: 3050, y: 100 },
        { x: 3250, y: 160 },
        { x: 3480, y: 120 },
        { x: 3680, y: 140 },
        { x: 3880, y: 100 }
    ];

    questionBricks.forEach(b => {
        level.platforms.push({
            x: b.x,
            y: b.y,
            width: 40,
            height: 20,
            type: 'question',
            hasCoin: true,
            coinCollected: false,
            bounceOffset: 0,
            bounceTime: 0
        });
    });

    // 金币 - 更少但位置更难
    const coinPositions = [
        { x: 180, y: 220 },
        { x: 320, y: 160 },
        { x: 480, y: 100 },
        { x: 650, y: 240 },
        { x: 820, y: 140 },
        { x: 1000, y: 80 },
        { x: 1200, y: 200 },
        { x: 1400, y: 120 },
        { x: 1620, y: 180 },
        { x: 1850, y: 220 },
        { x: 2080, y: 140 },
        { x: 2280, y: 80 },
        { x: 2520, y: 200 },
        { x: 2720, y: 120 },
        { x: 2920, y: 100 },
        { x: 3180, y: 160 },
        { x: 3450, y: 120 },
        { x: 3650, y: 160 },
        { x: 3850, y: 100 }
    ];

    coinPositions.forEach(c => {
        level.coins.push({
            x: c.x,
            y: c.y,
            width: 20,
            height: 20,
            collected: false,
            frame: 0
        });
    });

    // 敌人 - 更快更多
    const enemyPositions = [
        { x: 300, y: 330, speed: 2.5 },
        { x: 500, y: 330, speed: 3 },
        { x: 700, y: 330, speed: 2.8 },
        { x: 900, y: 330, speed: 3.2 },
        { x: 1100, y: 330, speed: 2.5 },
        { x: 1300, y: 330, speed: 3.5 },
        { x: 1500, y: 330, speed: 2.8 },
        { x: 1700, y: 330, speed: 3 },
        { x: 1950, y: 330, speed: 3.2 },
        { x: 2150, y: 330, speed: 2.5 },
        { x: 2350, y: 330, speed: 3.5 },
        { x: 2550, y: 330, speed: 2.8 },
        { x: 2750, y: 330, speed: 3 },
        { x: 2950, y: 330, speed: 3.2 },
        { x: 3150, y: 330, speed: 2.5 },
        { x: 3400, y: 330, speed: 3.5 },
        { x: 3600, y: 330, speed: 3 },
        { x: 3800, y: 330, speed: 3.2 }
    ];

    enemyPositions.forEach(e => {
        level.enemies.push({
            x: e.x,
            y: e.y,
            width: 32,
            height: 32,
            velocityX: -Math.random() > 0.5 ? e.speed : -e.speed,
            alive: true,
            frame: 0,
            squish: 0,
            squishTime: 0
        });
    });

    // 更新敌人碰撞检测的y位置
    level.enemies.forEach(e => {
        e.y = e.y - 2;
    });

    // 终点旗帜
    level.flag = {
        x: 3800,
        y: 160,
        width: 10,
        height: 200
    };
}

// 第三关 - 专家难度
function initLevel3() {
    level.width = 4800;

    // 地面 - 更多坑洞
    for (let i = 0; i < 60; i++) {
        // 在某些位置创建坑洞
        if (i >= 6 && i <= 9) continue;  // 第一个坑
        if (i >= 15 && i <= 18) continue; // 第二个坑
        if (i >= 24 && i <= 28) continue; // 第三个坑
        if (i >= 33 && i <= 37) continue; // 第四个坑
        if (i >= 42 && i <= 46) continue; // 第五个坑
        if (i >= 51 && i <= 54) continue; // 第六个坑

        level.platforms.push({
            x: i * 80,
            y: 360,
            width: 80,
            height: 40,
            type: 'ground'
        });
    }

    // 悬浮平台 - 极高且极分散
    const floatingPlatforms = [
        { x: 150, y: 240, width: 80, hasCoin: true },
        { x: 280, y: 180, width: 60 },
        { x: 400, y: 120, width: 80, hasCoin: true },
        { x: 600, y: 260, width: 100 },
        { x: 800, y: 140, width: 60, hasCoin: true },
        { x: 950, y: 100, width: 80 },
        { x: 1150, y: 220, width: 120 },
        { x: 1350, y: 140, width: 60, hasCoin: true },
        { x: 1500, y: 80, width: 80 },
        { x: 1700, y: 200, width: 100, hasCoin: true },
        { x: 1900, y: 120, width: 60 },
        { x: 2100, y: 180, width: 80, hasCoin: true },
        { x: 2300, y: 100, width: 60 },
        { x: 2500, y: 240, width: 120 },
        { x: 2750, y: 160, width: 80, hasCoin: true },
        { x: 2950, y: 100, width: 60 },
        { x: 3150, y: 180, width: 100 },
        { x: 3400, y: 120, width: 80, hasCoin: true },
        { x: 3600, y: 200, width: 60 },
        { x: 3800, y: 140, width: 80, hasCoin: true },
        { x: 4000, y: 220, width: 100 },
        { x: 4200, y: 100, width: 60 },
        { x: 4400, y: 160, width: 80, hasCoin: true },
        { x: 4600, y: 120, width: 60 }
    ];

    floatingPlatforms.forEach(p => {
        level.platforms.push({
            x: p.x,
            y: p.y,
            width: p.width,
            height: 20,
            type: p.hasCoin ? 'question' : 'brick',
            hasCoin: p.hasCoin || false,
            coinCollected: false,
            bounceOffset: 0,
            bounceTime: 0
        });
    });

    // 单独的问号砖块 - 极分散且位置更高
    const questionBricks = [
        { x: 100, y: 160 },
        { x: 220, y: 80 },
        { x: 350, y: 60 },
        { x: 500, y: 100 },
        { x: 680, y: 140 },
        { x: 880, y: 60 },
        { x: 1050, y: 40 },
        { x: 1250, y: 120 },
        { x: 1450, y: 80 },
        { x: 1620, y: 40 },
        { x: 1820, y: 100 },
        { x: 2020, y: 140 },
        { x: 2220, y: 60 },
        { x: 2420, y: 80 },
        { x: 2680, y: 120 },
        { x: 2880, y: 60 },
        { x: 3080, y: 80 },
        { x: 3280, y: 140 },
        { x: 3520, y: 60 },
        { x: 3720, y: 100 },
        { x: 3920, y: 140 },
        { x: 4120, y: 60 },
        { x: 4320, y: 100 },
        { x: 4520, y: 80 },
        { x: 4680, y: 60 }
    ];

    questionBricks.forEach(b => {
        level.platforms.push({
            x: b.x,
            y: b.y,
            width: 40,
            height: 20,
            type: 'question',
            hasCoin: true,
            coinCollected: false,
            bounceOffset: 0,
            bounceTime: 0
        });
    });

    // 金币 - 极少但位置极具挑战性
    const coinPositions = [
        { x: 120, y: 200 },
        { x: 250, y: 140 },
        { x: 380, y: 80 },
        { x: 580, y: 220 },
        { x: 820, y: 100 },
        { x: 1000, y: 60 },
        { x: 1200, y: 180 },
        { x: 1400, y: 100 },
        { x: 1620, y: 60 },
        { x: 1850, y: 140 },
        { x: 2080, y: 180 },
        { x: 2280, y: 80 },
        { x: 2520, y: 200 },
        { x: 2720, y: 120 },
        { x: 2980, y: 60 },
        { x: 3180, y: 140 },
        { x: 3450, y: 80 },
        { x: 3650, y: 160 },
        { x: 3880, y: 100 },
        { x: 4080, y: 160 },
        { x: 4280, y: 80 },
        { x: 4480, y: 120 },
        { x: 4650, y: 80 }
    ];

    coinPositions.forEach(c => {
        level.coins.push({
            x: c.x,
            y: c.y,
            width: 20,
            height: 20,
            collected: false,
            frame: 0
        });
    });

    // 敌人 - 最快最多
    const enemyPositions = [
        { x: 250, y: 330, speed: 3 },
        { x: 450, y: 330, speed: 3.5 },
        { x: 650, y: 330, speed: 3.2 },
        { x: 850, y: 330, speed: 3.8 },
        { x: 1050, y: 330, speed: 3 },
        { x: 1250, y: 330, speed: 3.5 },
        { x: 1450, y: 330, speed: 3.8 },
        { x: 1650, y: 330, speed: 3.2 },
        { x: 1850, y: 330, speed: 3.5 },
        { x: 2050, y: 330, speed: 3 },
        { x: 2250, y: 330, speed: 3.8 },
        { x: 2450, y: 330, speed: 3.2 },
        { x: 2650, y: 330, speed: 3.5 },
        { x: 2850, y: 330, speed: 3 },
        { x: 3050, y: 330, speed: 3.8 },
        { x: 3250, y: 330, speed: 3.2 },
        { x: 3450, y: 330, speed: 3.5 },
        { x: 3650, y: 330, speed: 3.8 },
        { x: 3850, y: 330, speed: 3 },
        { x: 4050, y: 330, speed: 3.5 },
        { x: 4250, y: 330, speed: 3.2 },
        { x: 4450, y: 330, speed: 3.8 },
        { x: 4650, y: 330, speed: 3.5 }
    ];

    enemyPositions.forEach(e => {
        level.enemies.push({
            x: e.x,
            y: e.y,
            width: 32,
            height: 32,
            velocityX: -Math.random() > 0.5 ? e.speed : -e.speed,
            alive: true,
            frame: 0,
            squish: 0,
            squishTime: 0
        });
    });

    // 更新敌人碰撞检测的y位置
    level.enemies.forEach(e => {
        e.y = e.y - 2;
    });

    // 终点旗帜
    level.flag = {
        x: 4600,
        y: 160,
        width: 10,
        height: 200
    };
}

// 绘制马里奥
function drawMario() {
    const screenX = mario.x - cameraX;

    ctx.save();

    // 动画帧
    const walkFrame = Math.abs(Math.sin(Date.now() / 100));
    const isMoving = mario.velocityX !== 0;
    const isJumping = !mario.grounded;

    // 根据方向翻转
    if (mario.direction === -1) {
        ctx.translate(screenX + mario.width / 2, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(screenX + mario.width / 2), 0);
    }

    const x = screenX;
    const y = mario.y;

    // === 帽子 ===
    // 主帽体
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 4, y, 20, 4);
    ctx.fillRect(x + 2, y + 4, 24, 4);

    // 帽檐
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 6, y + 8, 16, 2);

    // 帽子阴影
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(x + 20, y + 2, 2, 2);
    ctx.fillRect(x + 22, y + 4, 2, 2);

    // === 脸部 ===
    // 皮肤
    ctx.fillStyle = '#ffa550';
    ctx.fillRect(x + 6, y + 8, 16, 8);
    ctx.fillRect(x + 4, y + 10, 2, 6);
    ctx.fillRect(x + 22, y + 10, 2, 6);

    // 脸颊
    ctx.fillStyle = '#ff9040';
    ctx.fillRect(x + 4, y + 12, 2, 2);
    ctx.fillRect(x + 22, y + 12, 2, 2);

    // 鼻子
    ctx.fillStyle = '#ffa550';
    ctx.fillRect(x + 20, y + 12, 4, 4);

    // === 眼睛 ===
    // 眼白
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 16, y + 10, 4, 2);

    // 眉毛
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 14, y + 8, 6, 1);

    // === 胡须/嘴巴 ===
    ctx.fillStyle = '#4a3000';
    ctx.fillRect(x + 20, y + 14, 4, 2);
    ctx.fillRect(x + 22, y + 12, 2, 2);

    // === 身体/衬衫 ===
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 6, y + 16, 16, 4);
    ctx.fillRect(x + 4, y + 18, 4, 4);
    ctx.fillRect(x + 20, y + 18, 4, 4);
    ctx.fillRect(x + 6, y + 20, 16, 4);

    // 衬衫阴影
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(x + 6, y + 20, 2, 2);
    ctx.fillRect(x + 18, y + 20, 2, 2);

    // === 背带裤 ===
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(x + 8, y + 22, 12, 4);
    ctx.fillRect(x + 6, y + 24, 16, 6);

    // 裤子高光
    ctx.fillStyle = '#4080ff';
    ctx.fillRect(x + 8, y + 24, 2, 2);
    ctx.fillRect(x + 18, y + 24, 2, 2);

    // === 手臂 ===
    ctx.fillStyle = '#ff0000';
    if (isJumping) {
        // 跳跃姿势 - 手臂向上
        ctx.fillRect(x + 2, y + 14, 4, 6);
        ctx.fillRect(x + 22, y + 14, 4, 6);
    } else if (isMoving) {
        // 行走摆臂
        const armOffset = Math.sin(Date.now() / 80) * 2;
        ctx.fillRect(x + 2, y + 16 + armOffset, 4, 6);
        ctx.fillRect(x + 22, y + 16 - armOffset, 4, 6);
    } else {
        // 站立
        ctx.fillRect(x + 2, y + 18, 4, 6);
        ctx.fillRect(x + 22, y + 18, 4, 6);
    }

    // 手
    ctx.fillStyle = '#ffa550';
    if (isJumping) {
        ctx.fillRect(x + 2, y + 10, 3, 4);
        ctx.fillRect(x + 23, y + 10, 3, 4);
    } else {
        ctx.fillRect(x + 2, y + 22, 3, 3);
        ctx.fillRect(x + 23, y + 22, 3, 3);
    }

    // === 腿/脚 ===
    ctx.fillStyle = '#0000ff';
    if (isJumping) {
        // 跳跃 - 腿伸直
        ctx.fillRect(x + 6, y + 28, 8, 4);
        ctx.fillRect(x + 14, y + 28, 8, 4);
    } else if (isMoving) {
        // 行走 - 腿交替
        const legOffset = Math.sin(Date.now() / 80) * 3;
        ctx.fillRect(x + 6, y + 28, 8, 6);
        ctx.fillRect(x + 14, y + 28, 8, 6);
    } else {
        // 站立
        ctx.fillRect(x + 6, y + 28, 8, 6);
        ctx.fillRect(x + 14, y + 28, 8, 6);
    }

    // 鞋子
    ctx.fillStyle = '#4a3000';
    if (isMoving) {
        const footLift = Math.sin(Date.now() / 80) * 2;
        ctx.fillRect(x + 4, y + 32 + footLift, 10, 4);
        ctx.fillRect(x + 18, y + 32 - footLift, 10, 4);
    } else {
        ctx.fillRect(x + 4, y + 32, 10, 4);
        ctx.fillRect(x + 18, y + 32, 10, 4);
    }

    // 鞋底
    ctx.fillStyle = '#2a1800';
    if (isMoving) {
        const footLift = Math.sin(Date.now() / 80) * 2;
        ctx.fillRect(x + 4, y + 34 + footLift, 10, 2);
        ctx.fillRect(x + 18, y + 34 - footLift, 10, 2);
    } else {
        ctx.fillRect(x + 4, y + 34, 10, 2);
        ctx.fillRect(x + 18, y + 34, 10, 2);
    }

    ctx.restore();
}

// 绘制平台
function drawPlatforms() {
    level.platforms.forEach(platform => {
        const screenX = Math.round(platform.x - cameraX);
        if (screenX > -platform.width && screenX < canvas.width) {
            // 更新弹跳动画
            if (platform.bounceTime > 0) {
                platform.bounceTime--;
                if (platform.bounceTime > 5) {
                    platform.bounceOffset = -4;
                } else {
                    platform.bounceOffset = 0;
                }
            }

            const drawY = Math.round(platform.y + platform.bounceOffset);
            const pw = platform.width;
            const ph = platform.height;

            if (platform.type === 'ground') {
                // === 地面 - 原版马里奥风格 ===

                // 草地层 - 鲜绿色
                ctx.fillStyle = '#00a800';
                ctx.fillRect(screenX, drawY, pw, 16);

                // 草地顶部亮边
                ctx.fillStyle = '#20e820';
                ctx.fillRect(screenX, drawY, pw, 2);

                // 草地纹理（像素点）
                ctx.fillStyle = '#00c800';
                for (let i = 0; i < pw; i += 8) {
                    if (screenX + i < canvas.width && screenX + i >= 0) {
                        ctx.fillRect(screenX + i, drawY + 2, 2, 2);
                        ctx.fillRect(screenX + i + 4, drawY + 4, 2, 2);
                    }
                }

                // 泥土层 - 棕色
                ctx.fillStyle = '#c84c0c';
                ctx.fillRect(screenX, drawY + 16, pw, ph - 16);

                // 泥土纹理（像素点）
                ctx.fillStyle = '#e07030';
                for (let i = 0; i < pw; i += 12) {
                    if (screenX + i < canvas.width && screenX + i >= 0) {
                        ctx.fillRect(screenX + i, drawY + 20, 4, 4);
                        ctx.fillRect(screenX + i + 6, drawY + 28, 4, 4);
                    }
                }

                // 泥土阴影
                ctx.fillStyle = '#a83c0c';
                ctx.fillRect(screenX, drawY + ph - 4, pw, 4);

            } else if (platform.type === 'question') {
                // === 问号砖块 - 原版风格 ===

                if (platform.coinCollected) {
                    // 已使用的问号块 - 深棕色
                    ctx.fillStyle = '#7c5430';
                    ctx.fillRect(screenX, drawY, pw, ph);

                    // 边框
                    ctx.fillStyle = '#504030';
                    ctx.fillRect(screenX, drawY, pw, 2);
                    ctx.fillRect(screenX, drawY + ph - 2, pw, 2);
                    ctx.fillRect(screenX, drawY, 2, ph);
                    ctx.fillRect(screenX + pw - 2, drawY, 2, ph);

                    // 内阴影
                    ctx.fillStyle = '#383028';
                    ctx.fillRect(screenX + 4, drawY + 4, 4, 4);
                    ctx.fillRect(screenX + pw - 8, drawY + ph - 8, 4, 4);

                } else {
                    // 活跃的问号块 - 金色动画
                    const time = Date.now() / 150;
                    const frame = Math.floor(time) % 4;
                    const goldColors = ['#fc9838', '#f87818', '#f85800', '#f87818'];
                    ctx.fillStyle = goldColors[frame];
                    ctx.fillRect(screenX, drawY, pw, ph);

                    // 边框
                    ctx.fillStyle = '#f83000';
                    ctx.fillRect(screenX, drawY, pw, 2);
                    ctx.fillRect(screenX, drawY + ph - 2, pw, 2);
                    ctx.fillRect(screenX, drawY, 2, ph);
                    ctx.fillRect(screenX + pw - 2, drawY, 2, ph);

                    // 四角钉子
                    ctx.fillStyle = '#f83000';
                    ctx.fillRect(screenX, drawY, 4, 4);
                    ctx.fillRect(screenX + pw - 4, drawY, 4, 4);
                    ctx.fillRect(screenX, drawY + ph - 4, 4, 4);
                    ctx.fillRect(screenX + pw - 4, drawY + ph - 4, 4, 4);

                    // 问号符号 - 像素风格
                    ctx.fillStyle = '#783800';
                    // 问号顶部
                    ctx.fillRect(screenX + pw / 2 - 2, drawY + 4, 4, 2);
                    ctx.fillRect(screenX + pw / 2 - 4, drawY + 6, 8, 2);
                    ctx.fillRect(screenX + pw / 2 - 4, drawY + 8, 4, 2);
                    ctx.fillRect(screenX + pw / 2, drawY + 8, 4, 2);
                    ctx.fillRect(screenX + pw / 2, drawY + 10, 4, 2);
                    // 问号底部
                    ctx.fillRect(screenX + pw / 2 - 2, drawY + 12, 4, 2);
                    ctx.fillRect(screenX + pw / 2 - 2, drawY + 14, 2, 2);
                }

            } else {
                // === 普通砖块 - 原版风格 ===

                // 砖块主体 - 棕色
                ctx.fillStyle = '#c84c0c';
                ctx.fillRect(screenX, drawY, pw, ph);

                // 砖块边缘
                ctx.fillStyle = '#e07030';
                ctx.fillRect(screenX, drawY, pw, 2);
                ctx.fillRect(screenX, drawY, 2, ph);

                // 砖块阴影
                ctx.fillStyle = '#a83c0c';
                ctx.fillRect(screenX, drawY + ph - 2, pw, 2);
                ctx.fillRect(screenX + pw - 2, drawY, 2, ph);

                // 砖块纹理 - 水平线
                ctx.fillStyle = '#a83c0c';
                ctx.fillRect(screenX, drawY + ph / 2, pw, 2);

                // 砖块纹理 - 垂直线（交错）
                const brickWidth = pw / 2;
                ctx.fillStyle = '#a83c0c';
                // 上半部分
                ctx.fillRect(screenX + brickWidth, drawY, 2, ph / 2);
                // 下半部分（错位）
                ctx.fillRect(screenX + brickWidth - brickWidth / 2, drawY + ph / 2, 2, ph / 2);
            }
        }
    });
}

// 绘制金币
function drawCoins() {
    level.coins.forEach(coin => {
        if (!coin.collected) {
            const screenX = coin.x - cameraX;
            if (screenX > -coin.width && screenX < canvas.width) {
                // 旋转动画
                const scaleX = Math.abs(Math.sin(Date.now() / 150));

                // 金币外圈
                ctx.fillStyle = '#ffa500';
                ctx.beginPath();
                ctx.ellipse(screenX + coin.width / 2, coin.y + coin.height / 2,
                           10 * scaleX, 12, 0, 0, Math.PI * 2);
                ctx.fill();

                // 金币主体
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.ellipse(screenX + coin.width / 2, coin.y + coin.height / 2,
                           8 * scaleX, 10, 0, 0, Math.PI * 2);
                ctx.fill();

                // 金币高光
                ctx.fillStyle = '#ffec8b';
                ctx.beginPath();
                ctx.ellipse(screenX + coin.width / 2 - 2 * scaleX, coin.y + coin.height / 2 - 3,
                           3 * scaleX, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    // 绘制从砖块弹出的金币
    level.poppedCoins.forEach((coin, index) => {
        const screenX = coin.x - cameraX;
        if (screenX > -30 && screenX < canvas.width + 30) {
            // 金币旋转效果
            const scaleX = Math.abs(Math.sin(coin.life / 3));

            // 金币外圈
            ctx.fillStyle = '#ffa500';
            ctx.beginPath();
            ctx.ellipse(screenX, coin.y, 13 * scaleX, 14, 0, 0, Math.PI * 2);
            ctx.fill();

            // 金币主体
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.ellipse(screenX, coin.y, 10 * scaleX, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // 金币高光
            ctx.fillStyle = '#ffec8b';
            ctx.beginPath();
            ctx.ellipse(screenX - 2 * scaleX, coin.y - 3, 4 * scaleX, 5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// 更新弹出的金币
function updatePoppedCoins() {
    level.poppedCoins.forEach((coin, index) => {
        coin.life++;
        coin.y -= coin.velocityY;
        coin.velocityY *= 0.92;

        // 移除已消失的金币
        if (coin.life > 60) {
            level.poppedCoins.splice(index, 1);
        }
    });
}

// 创建弹出金币效果
function createPoppedCoin(x, y) {
    level.poppedCoins.push({
        x: x,
        y: y,
        velocityY: 8,
        life: 0
    });
    score += 100;
    updateScoreDisplay();
    SoundEffects.coin();
}

// 更新粒子效果
function updateParticles() {
    level.particles.forEach((particle, index) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.2; // 重力
        particle.life--;

        if (particle.life <= 0) {
            level.particles.splice(index, 1);
        }
    });
}

// 绘制粒子效果
function drawParticles() {
    level.particles.forEach(particle => {
        const screenX = particle.x - cameraX;
        const alpha = particle.life / 30;
        ctx.fillStyle = particle.color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        ctx.beginPath();
        ctx.arc(screenX, particle.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 绘制敌人
function drawEnemies() {
    level.enemies.forEach(enemy => {
        const screenX = enemy.x - cameraX;
        if (screenX > -enemy.width && screenX < canvas.width) {
            const x = screenX;
            const y = enemy.y;
            const time = Date.now() / 120;
            const walkCycle = Math.sin(time * (Math.abs(enemy.velocityX) > 0 ? 1.5 : 0.5));

            // 显示被压扁的敌人
            if (enemy.squishTime > 0) {
                enemy.squishTime--;
                const squishProgress = 1 - (enemy.squishTime / 20);

                // 压扁的栗宝宝
                ctx.fillStyle = '#b85c00';  // 棕色身体
                ctx.fillRect(x + 4, y + 24, 24, 8);
                ctx.fillStyle = '#d47420';  // 较浅的棕色
                ctx.fillRect(x + 6, y + 22, 20, 4);

                // 压扁的头部
                ctx.fillStyle = '#b85c00';
                ctx.beginPath();
                ctx.ellipse(x + 16, y + 24, 14 * (1 - squishProgress * 0.3), 6, 0, 0, Math.PI * 2);
                ctx.fill();

                if (enemy.squishTime <= 1) {
                    enemy.alive = false;
                }
                return;
            }

            if (!enemy.alive) return;

            // === 栗宝宝/Goomba 像素风格 ===

            // === 蘑菇头/身体上半部分 ===
            // 主头部 - 棕色大蘑菇形状
            ctx.fillStyle = '#b85c00';
            ctx.beginPath();
            ctx.moveTo(x + 4, y + 14);
            ctx.lineTo(x + 28, y + 14);
            ctx.lineTo(x + 30, y + 18);
            ctx.lineTo(x + 28, y + 22);
            ctx.lineTo(x + 4, y + 22);
            ctx.lineTo(x + 2, y + 18);
            ctx.closePath();
            ctx.fill();

            // 头部顶部圆弧
            ctx.fillStyle = '#d47420';
            ctx.fillRect(x + 6, y + 10, 20, 4);
            ctx.fillRect(x + 8, y + 6, 16, 4);
            ctx.fillRect(x + 10, y + 2, 12, 4);

            // 头部高光
            ctx.fillStyle = '#e89440';
            ctx.fillRect(x + 10, y + 4, 6, 2);
            ctx.fillRect(x + 8, y + 8, 4, 2);

            // === 身体下半部分 ===
            ctx.fillStyle = '#b85c00';
            ctx.fillRect(x + 6, y + 20, 20, 6);
            ctx.fillRect(x + 4, y + 22, 24, 4);

            // 身体阴影
            ctx.fillStyle = '#8c4400';
            ctx.fillRect(x + 22, y + 20, 4, 2);
            ctx.fillRect(x + 24, y + 22, 4, 4);

            // === 眉毛 (愤怒表情) ===
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 8, y + 10, 6, 2);
            ctx.fillRect(x + 18, y + 10, 6, 2);

            // === 眼睛 ===
            // 眼白
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 8, y + 12, 6, 6);
            ctx.fillRect(x + 18, y + 12, 6, 6);

            // 瞳孔
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 10, y + 14, 3, 3);
            ctx.fillRect(x + 20, y + 14, 3, 3);

            // 眼睛高光
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 11, y + 15, 1, 1);
            ctx.fillRect(x + 21, y + 15, 1, 1);

            // === 嘴巴 (像原版一样的尖牙表情) ===
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 12, y + 20, 8, 2);

            // 尖牙
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 12, y + 20, 2, 3);
            ctx.fillRect(x + 18, y + 20, 2, 3);

            // === 脚 ===
            const leftFootOffset = walkCycle * 2;
            const rightFootOffset = -walkCycle * 2;

            // 左脚
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 2, y + 26 + leftFootOffset, 10, 4);
            ctx.fillRect(x, y + 28 + leftFootOffset, 10, 4);

            // 右脚
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 20, y + 26 + rightFootOffset, 10, 4);
            ctx.fillRect(x + 22, y + 28 + rightFootOffset, 10, 4);

            // 脚底/鞋底
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(x, y + 30 + leftFootOffset, 10, 2);
            ctx.fillRect(x + 22, y + 30 + rightFootOffset, 10, 2);
        }
    });
}

// 绘制旗帜
function drawFlag() {
    const screenX = Math.round(level.flag.x - cameraX);
    if (screenX > -50 && screenX < canvas.width) {
        const fx = screenX;
        const fy = level.flag.y;

        // === 旗杆底座 ===
        // 砖块底座
        ctx.fillStyle = '#c84c0c';
        ctx.fillRect(fx - 6, fy + 160, 22, 20);
        // 底座阴影
        ctx.fillStyle = '#a83c0c';
        ctx.fillRect(fx - 6, fy + 176, 22, 4);
        // 底座高光
        ctx.fillStyle = '#e07030';
        ctx.fillRect(fx - 6, fy + 160, 22, 2);

        // === 旗杆 ===
        // 主杆 - 深绿色
        ctx.fillStyle = '#007800';
        ctx.fillRect(fx - 2, fy, 8, 160);
        // 旗杆高光
        ctx.fillStyle = '#10a810';
        ctx.fillRect(fx - 2, fy, 2, 160);
        // 旗杆阴影
        ctx.fillStyle = '#005800';
        ctx.fillRect(fx + 4, fy, 2, 160);

        // === 旗杆顶部 ===
        // 球形顶端
        ctx.fillStyle = '#007800';
        ctx.beginPath();
        ctx.arc(fx + 2, fy, 8, 0, Math.PI * 2);
        ctx.fill();
        // 顶端高光
        ctx.fillStyle = '#10c810';
        ctx.fillRect(fx - 2, fy - 4, 4, 4);

        // === 旗帜 ===
        // 旗杆（顶部球到旗帜部分）
        ctx.fillStyle = '#007800';
        ctx.fillRect(fx - 2, fy + 8, 8, 20);

        // 红色旗帜
        ctx.fillStyle = '#e81800';
        // 主体
        ctx.fillRect(fx + 6, fy + 10, 50, 40);
        // 底部三角形
        ctx.fillRect(fx + 6, fy + 50, 50, 10);
        ctx.fillRect(fx + 56, fy + 50, 10, 10);
        ctx.fillRect(fx + 46, fy + 60, 20, 5);
        ctx.fillRect(fx + 36, fy + 65, 30, 5);
        ctx.fillRect(fx + 26, fy + 70, 40, 5);
        ctx.fillRect(fx + 16, fy + 75, 50, 5);
        ctx.fillRect(fx + 6, fy + 80, 60, 5);

        // 旗帜高光
        ctx.fillStyle = '#f83820';
        ctx.fillRect(fx + 6, fy + 10, 50, 2);
        ctx.fillRect(fx + 6, fy + 10, 2, 40);

        // 旗帜阴影
        ctx.fillStyle = '#a80800';
        ctx.fillRect(fx + 54, fy + 10, 2, 40);
    }
}

// 绘制背景
function drawBackground() {
    // 天空 - 原版马里奥蓝色
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // === 像素风格云朵 ===
    const clouds = [
        { x: 100, y: 45 },
        { x: 450, y: 55 },
        { x: 800, y: 40 },
        { x: 1150, y: 60 },
        { x: 1500, y: 45 },
        { x: 1850, y: 55 },
        { x: 2200, y: 40 },
        { x: 2550, y: 50 },
        { x: 2900, y: 45 },
    ];

    clouds.forEach(cloud => {
        const screenX = cloud.x - cameraX * 0.25;
        const cx = Math.round(screenX);
        const cy = cloud.y;

        // 绘制像素云朵
        ctx.fillStyle = '#fff';

        // 云朵 - 小型
        // 第一层
        ctx.fillRect(cx, cy + 12, 8, 8);
        ctx.fillRect(cx + 8, cy + 8, 8, 12);
        ctx.fillRect(cx + 16, cy + 4, 16, 16);
        ctx.fillRect(cx + 32, cy + 8, 8, 12);
        ctx.fillRect(cx + 40, cy + 12, 8, 8);

        // 第二层
        ctx.fillRect(cx + 8, cy + 4, 8, 8);
        ctx.fillRect(cx + 24, cy, 16, 8);
        ctx.fillRect(cx + 40, cy + 4, 8, 8);
    });

    // === 像素风格山丘 ===
    const hills = [
        { x: 0, width: 160, height: 80 },
        { x: 250, width: 120, height: 60 },
        { x: 500, width: 200, height: 90 },
        { x: 800, width: 100, height: 50 },
        { x: 1050, width: 180, height: 75 },
        { x: 1350, width: 140, height: 65 },
        { x: 1600, width: 100, height: 45 },
        { x: 1850, width: 220, height: 85 },
        { x: 2200, width: 130, height: 55 },
        { x: 2450, width: 170, height: 70 },
        { x: 2750, width: 150, height: 60 },
        { x: 3000, width: 200, height: 80 },
    ];

    hills.forEach(hill => {
        const screenX = hill.x - cameraX * 0.5;
        const hx = Math.round(screenX);
        const hy = 360 - hill.height;
        const hw = hill.width;
        const hh = hill.height;

        // 山丘主体 - 绿色
        ctx.fillStyle = '#00a800';
        // 绘制三角形山丘
        for (let i = 0; i < hill.height; i += 4) {
            const rowWidth = Math.floor((i / hh) * (hw / 2));
            ctx.fillRect(hx + hw / 2 - rowWidth, hy + i, rowWidth * 2, 4);
        }

        // 山丘条纹装饰 - 深绿色
        ctx.fillStyle = '#008800';
        // 左侧条纹
        ctx.fillRect(hx + hw / 2 - hw / 4, hy + hh * 0.4, hw / 8, 4);
        ctx.fillRect(hx + hw / 2 - hw / 3, hy + hh * 0.6, hw / 6, 4);
        // 右侧条纹
        ctx.fillRect(hx + hw / 2 + hw / 8, hy + hh * 0.5, hw / 8, 4);
        ctx.fillRect(hx + hw / 2 + hw / 6, hy + hh * 0.7, hw / 6, 4);

        // 山丘顶部亮点
        ctx.fillStyle = '#10c810';
        ctx.fillRect(hx + hw / 2 - 4, hy, 8, 4);
    });

    // === 灌木丛 ===
    const bushes = [
        { x: 50, width: 80 },
        { x: 380, width: 60 },
        { x: 700, width: 100 },
        { x: 1000, width: 70 },
        { x: 1300, width: 90 },
        { x: 1700, width: 60 },
        { x: 2000, width: 110 },
        { x: 2400, width: 80 },
        { x: 2700, width: 70 },
        { x: 3050, width: 100 },
    ];

    bushes.forEach(bush => {
        const screenX = bush.x - cameraX * 0.7;
        const bx = Math.round(screenX);
        const by = 345;
        const bw = bush.width;

        // 灌木主体 - 绿色
        ctx.fillStyle = '#00c800';
        // 底部
        ctx.fillRect(bx, by, bw, 15);
        // 中层凸起
        const mounds = Math.ceil(bw / 16);
        for (let i = 0; i < mounds; i++) {
            const moundX = bx + i * 16;
            const moundW = Math.min(16, bw - i * 16);
            ctx.fillRect(moundX, by - 4, moundW, 4);
            if (i % 2 === 0) {
                ctx.fillRect(moundX + 4, by - 8, moundW - 8, 4);
            }
        }

        // 灌木阴影 - 深绿色
        ctx.fillStyle = '#00a800';
        ctx.fillRect(bx, by + 10, bw, 5);
    });

    // === 远景山脉 ===
    const farHills = [
        { x: 0, y: 200, width: 200, height: 100 },
        { x: 350, y: 220, width: 150, height: 80 },
        { x: 650, y: 190, width: 250, height: 120 },
        { x: 1000, y: 210, width: 180, height: 90 },
        { x: 1300, y: 200, width: 200, height: 100 },
        { x: 1650, y: 230, width: 140, height: 70 },
        { x: 1950, y: 195, width: 220, height: 110 },
        { x: 2300, y: 215, width: 160, height: 85 },
        { x: 2600, y: 205, width: 190, height: 95 },
        { x: 2950, y: 200, width: 200, height: 100 },
    ];

    farHills.forEach(hill => {
        const screenX = hill.x - cameraX * 0.15;
        const hx = Math.round(screenX);
        const hw = hill.width;
        const hh = hill.height;

        // 远山 - 浅绿色/蓝绿色
        ctx.fillStyle = '#6ebf68';
        // 绘制远山轮廓
        ctx.beginPath();
        ctx.moveTo(hx, hill.y + hh);
        ctx.lineTo(hx + hw / 2, hill.y);
        ctx.lineTo(hx + hw, hill.y + hh);
        ctx.closePath();
        ctx.fill();

        // 远山条纹
        ctx.fillStyle = '#5aaf54';
        ctx.fillRect(hx + hw / 2 - hw / 4, hill.y + hh * 0.3, hw / 6, 3);
        ctx.fillRect(hx + hw / 2 + hw / 8, hill.y + hh * 0.5, hw / 8, 3);
    });
}

// 绘制游戏结束画面
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameOver === 'win' ? 'LEVEL CLEARED!' : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = '20px Arial';
    ctx.fillText('PRESS R TO RESTART', canvas.width / 2, canvas.height / 2 + 30);

    ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 70);
}

// 碰撞检测
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 更新游戏状态
function update() {
    if (gameOver) return;

    // 马里奥移动
    if (keys.left) {
        mario.velocityX = -mario.speed;
        mario.direction = -1;
    } else if (keys.right) {
        mario.velocityX = mario.speed;
        mario.direction = 1;
    } else {
        mario.velocityX = 0;
    }

    // 跳跃
    if (keys.jump && mario.grounded) {
        mario.velocityY = mario.jumpPower;
        mario.grounded = false;
        SoundEffects.jump();
    }

    // 应用重力
    mario.velocityY += mario.gravity;

    // 更新位置
    mario.x += mario.velocityX;
    mario.y += mario.velocityY;

    // 边界检查
    if (mario.x < 0) mario.x = 0;
    if (mario.x > level.width - mario.width) mario.x = level.width - mario.width;

    // 平台碰撞
    mario.grounded = false;
    level.platforms.forEach(platform => {
        if (checkCollision(mario, platform)) {
            // 从上方落下
            if (mario.velocityY > 0 && mario.y + mario.height - mario.velocityY <= platform.y) {
                mario.y = platform.y - mario.height;
                mario.velocityY = 0;
                mario.grounded = true;
            }
            // 从下方撞击
            else if (mario.velocityY < 0 && mario.y - mario.velocityY >= platform.y + platform.height) {
                mario.y = platform.y + platform.height;
                mario.velocityY = 0;

                // 撞击音效
                SoundEffects.bump();

                // 检查是否是问号砖块
                if (platform.type === 'question' && platform.hasCoin && !platform.coinCollected) {
                    platform.coinCollected = true;
                    platform.bounceTime = 10;
                    createPoppedCoin(platform.x + platform.width / 2, platform.y - 10);
                } else if (platform.type === 'question' || platform.type === 'brick') {
                    // 普通砖块也有轻微弹跳效果
                    platform.bounceTime = 5;
                }
            }
            // 从侧面碰撞
            else if (mario.velocityX !== 0) {
                if (mario.velocityX > 0) {
                    mario.x = platform.x - mario.width;
                } else {
                    mario.x = platform.x + platform.width;
                }
            }
        }
    });

    // 金币收集
    level.coins.forEach(coin => {
        if (!coin.collected && checkCollision(mario, coin)) {
            coin.collected = true;
            score += 100;
            updateScoreDisplay();
            SoundEffects.coin();
        }
    });

    // 更新弹出的金币
    updatePoppedCoins();

    // 更新粒子效果
    updateParticles();

    // 敌人更新和碰撞
    level.enemies.forEach(enemy => {
        if (enemy.alive) {
            // 移动敌人
            enemy.x += enemy.velocityX;

            // 敌人碰到平台边缘转身
            let onEdge = true;
            level.platforms.forEach(platform => {
                if (enemy.x + enemy.width > platform.x &&
                    enemy.x < platform.x + platform.width &&
                    enemy.y + enemy.height === platform.y) {
                    onEdge = false;
                }
            });

            if (onEdge || enemy.x < 0 || enemy.x > level.width - enemy.width) {
                enemy.velocityX *= -1;
            }

            // 与马里奥碰撞
            if (checkCollision(mario, enemy)) {
                // 从上方踩到敌人
                if (mario.velocityY > 0 && mario.y + mario.height - mario.velocityY <= enemy.y + 10) {
                    enemy.alive = false;
                    enemy.squishTime = 20; // 添加压扁动画时间
                    mario.velocityY = mario.jumpPower * 0.6;
                    score += 200;
                    updateScoreDisplay();
                    SoundEffects.stomp();

                    // 添加粒子效果
                    for (let i = 0; i < 8; i++) {
                        level.particles.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height / 2,
                            velocityX: (Math.random() - 0.5) * 6,
                            velocityY: (Math.random() - 0.5) * 6,
                            life: 30,
                            color: `rgb(${184 + Math.random() * 30}, ${92 + Math.random() * 20}, ${0 + Math.random() * 10})`
                        });
                    }
                } else {
                    // 马里奥受伤
                    lives--;
                    document.getElementById('lives').textContent = lives;
                    SoundEffects.hurt();
                    if (lives <= 0) {
                        gameOver = 'lose';
                        SoundEffects.gameOver();
                    } else {
                        // 重置马里奥位置
                        mario.x = 100;
                        mario.y = 300;
                        mario.velocityX = 0;
                        mario.velocityY = 0;
                        cameraX = 0;
                    }
                }
            }
        }
    });

    // 掉落检测
    if (mario.y > canvas.height) {
        lives--;
        document.getElementById('lives').textContent = lives;
        SoundEffects.hurt();
        if (lives <= 0) {
            gameOver = 'lose';
            SoundEffects.gameOver();
        } else {
            mario.x = 100;
            mario.y = 300;
            mario.velocityX = 0;
            mario.velocityY = 0;
            cameraX = 0;
        }
    }

    // 到达终点
    if (checkCollision(mario, level.flag)) {
        if (currentLevel < 3) {
            // 进入下一关
            currentLevel++;
            maxLevelReached = currentLevel; // 更新到达的最高关卡
            updateWorldDisplay();
            score += 1000;
            updateScoreDisplay();
            SoundEffects.win();

            // 重置马里奥位置但不重置分数和生命
            mario.x = 100;
            mario.y = 300;
            mario.velocityX = 0;
            mario.velocityY = 0;
            cameraX = 0;
            level.poppedCoins = [];
            level.particles = [];
            initLevel();
        } else {
            // 通关所有关卡
            gameOver = 'win';
            score += 1000;
            updateScoreDisplay();
            SoundEffects.win();
        }
    }

    // 更新相机
    cameraX = mario.x - canvas.width / 3;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > level.width - canvas.width) cameraX = level.width - canvas.width;
}

// 绘制游戏
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawFlag();
    drawMario();
    drawParticles();

    if (gameOver) {
        drawGameOver();
    }
}

// 游戏循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 重新开始游戏
function restartGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    currentLevel = maxLevelReached; // 从到达的最高关卡重新开始
    updateWorldDisplay();
    mario.x = 100;
    mario.y = 300;
    mario.velocityX = 0;
    mario.velocityY = 0;
    cameraX = 0;
    updateScoreDisplay();
    document.getElementById('lives').textContent = lives;
    level.poppedCoins = [];
    level.particles = [];
    initLevel();
}

// 键盘事件
document.addEventListener('keydown', (e) => {
    initAudio(); // 初始化音频（首次交互时）
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keys.jump = true;
        e.preventDefault();
    }
    if (e.code === 'KeyR') restartGame();
    if (e.code === 'KeyM') toggleSound();
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') keys.jump = false;
});

// 音效按钮事件
document.getElementById('soundToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    toggleSound();
});

// 点击游戏区域初始化音频
canvas.addEventListener('click', () => {
    initAudio();
});

// 初始化并开始游戏
updateWorldDisplay();
initLevel();
gameLoop();
