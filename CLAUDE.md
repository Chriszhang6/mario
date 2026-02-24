# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Super Mario Bros - Browser Edition is a single-file HTML5 Canvas platformer game with no external dependencies or build tools. All game logic is contained in `mario.js` (~16,000 lines of vanilla JavaScript).

## Running the Game

```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

No build step, linting, or test commands exist - this is a pure vanilla JavaScript project.

## Architecture

### Core Game Loop

The game follows a standard game loop pattern (`gameLoop()` function):
- `update()` - Handles all game logic, physics, collision detection
- `draw()` - Renders everything to Canvas
- `requestAnimationFrame()` - Binds to browser refresh rate

### Key Data Structures

**Global State (`score`, `lives`, `gameOver`, `cameraX`, `currentLevel`)**
- Tracks game-wide state across level transitions

**Mario Object (`mario`)**
- Position (x, y), velocity (velocityX, velocityY), dimensions
- Properties: speed, jumpPower, gravity, direction, grounded, frame, invincible, dead
- All physics and movement logic operates on this object

**Level Object (`level`)**
- `platforms[]` - Array of platform objects (ground, brick, question blocks)
- `coins[]` - Collectible coins with rotation animation
- `enemies[]` - Enemy objects with patrol behavior
- `flag` - Level completion object
- `poppedCoins[]` - Coins that pop from question blocks
- `particles[]` - Visual effect particles

### Level System

Levels are defined in `initLevel1()` and `initLevel2()` functions:
- Level 1: 3200px width, 10 enemies, beginner-friendly
- Level 2: 4000px width, 18 faster enemies, 4 pits, harder platforming

Platform types: `ground`, `brick`, `question`, `hard`

### Rendering System

All graphics are procedurally drawn using Canvas API - no sprite sheets:
- `drawMario()` - Pixel art character with animation frames
- `drawPlatforms()` - Tiles with question block animations
- `drawCoins()` - Rotating coin effect
- `drawEnemies()` - Walking enemy animation
- `drawBackground()` - Parallax scrolling clouds and hills
- `drawFlag()` - Level completion flag

Camera system (`cameraX`) creates side-scrolling effect by offsetting draw positions.

### Audio System

SoundEffects object contains procedural audio using Web Audio API:
- `jump`, `coin`, `stomp`, `hurt`, `gameOver`, `win`, `bump`
- All sounds are synthesized oscillators (square, sine, sawtooth waves)
- Audio context must be initialized on user interaction (`initAudio()`)

### Physics & Collision

- AABB collision detection in `checkCollision()`
- Platform collision handles top (landing), bottom (head bump), and side collisions
- Gravity applied continuously when not grounded
- Question blocks trigger coin pop on bottom collision

### Input Handling

Keyboard state tracked in `keys` object:
- Arrow keys or WASD for movement
- Space/Up/W for jump
- R to restart, M to toggle sound

## Code Organization

When modifying this codebase:
1. **Game mechanics** - Look in `update()` for physics and game logic
2. **Visuals** - Drawing functions are prefixed with `draw`
3. **Sound** - All audio in `SoundEffects` object
4. **Level design** - Modify `initLevel1()` or `initLevel2()` functions
5. **New levels** - Add to `initLevel()` switch statement and create corresponding init function

## Important Constraints

- No external dependencies allowed
- Single-file architecture (all code in mario.js)
- Audio context requires user interaction before sound works
- Canvas coordinate system: (0,0) is top-left
- All measurements in pixels
