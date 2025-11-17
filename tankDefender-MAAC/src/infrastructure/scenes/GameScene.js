/**
 * GameScene — Main Gameplay Scene with Player Movement
 * 
 * Integrates all movement components:
 * - Domain: Tank entities, MovementService
 * - Application: HandlePlayerInput, MovePlayer use cases
 * - Adapters: KeyboardInputAdapter, PhaserPhysicsAdapter, TankSpriteAdapter
 * 
 * @module infrastructure/scenes/GameScene
 */

import Tank from '../../domain/entities/Tank.js';
import HandlePlayerInput from '../../application/use-cases/HandlePlayerInput.js';
import MovePlayer from '../../application/use-cases/MovePlayer.js';
import KeyboardInputAdapter from '../../adapters/input/KeyboardInputAdapter.js';
import PhaserPhysicsAdapter from '../../adapters/physics/PhaserPhysicsAdapter.js';
import TankSpriteAdapter from '../../adapters/rendering/TankSpriteAdapter.js';

// Enemy imports
import Enemy from '../../domain/entities/Enemy.js';
import SpawnManager from '../../domain/services/SpawnManager.js';
import TargetingService from '../../domain/services/TargetingService.js';
import EnemyAI from '../../domain/services/EnemyAI.js';
import { calculateVelocity } from '../../domain/services/MovementService.js';
import SpawnEnemy from '../../application/use-cases/SpawnEnemy.js';
import UpdateEnemyAI from '../../application/use-cases/UpdateEnemyAI.js';
import DestroyEnemy from '../../application/use-cases/DestroyEnemy.js';
import EnemySpriteAdapter from '../../adapters/rendering/EnemySpriteAdapter.js';
import HUDAdapter from '../../adapters/hud/HUDAdapter.js';
import ProjectileSystemAdapter from '../../adapters/projectile/ProjectileSystemAdapter.js';

/**
 * Main gameplay scene with player movement
 * @extends Phaser.Scene
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    // State
    this.gameState = null;
    this.tanks = new Map(); // entityId -> Tank instance
    
    // Adapters
    this.inputAdapter = null;
    this.physicsAdapter = null;
    this.renderAdapter = null;
    this.enemyRenderer = null;
    this.hudAdapter = null;
    this.projectileSystem = null;
    
    // Use Cases
    this.handlePlayerInput = null;
    this.movePlayer = null;
    
    // Enemy system
    this.spawnManager = null;
    this.targetingService = null;
    this.enemyAI = null;
    this.spawnEnemy = null;
    this.updateEnemyAI = null;
    this.destroyEnemy = null;
  }

  /**
   * Initialize scene data from MenuScene
   * @param {Object} data - Initialization bundle from StartGame use case
   */
  init(data) {
    this.gameState = data;
  }

  /**
   * Preload assets
   */
  preload() {
    // Create placeholder graphics (no external assets needed)
    // Phaser will auto-generate colored rectangles for missing images
  }

  /**
   * Create game objects and initialize systems
   */
  create() {
    const { mode, players } = this.gameState;

    // 0. Create placeholder graphics
    this._createPlaceholderGraphics();

    // 1. Initialize adapters
    this.inputAdapter = new KeyboardInputAdapter(this.input.keyboard);
    this.physicsAdapter = new PhaserPhysicsAdapter(this.physics);
    this.renderAdapter = new TankSpriteAdapter(this);
    this.enemyRenderer = new EnemySpriteAdapter(this);
    this.hudAdapter = new HUDAdapter();
    this.projectileSystem = new ProjectileSystemAdapter(this, this.physicsAdapter);

    // 2. Initialize use cases
    this.handlePlayerInput = new HandlePlayerInput(this.inputAdapter);
    this.movePlayer = new MovePlayer(this.physicsAdapter, this.renderAdapter);

    // 3. Initialize enemy system
    this._initializeEnemySystem();

    // 4. Register player keys (P1: WASD, P2: Arrows)
    this.inputAdapter.registerKeys('P1', ['W', 'A', 'S', 'D']);
    if (mode === '2P') {
      this.inputAdapter.registerKeys('P2', ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
    }

    // 5. Create player tanks
    this._createPlayerTanks(players);

    // 6. Create map and collisions
    this._createMap();

    // 7. Set up projectile collisions
    this._setupProjectileCollisions();
  }

  /**
   * Create placeholder graphics for tanks and tiles
   * @private
   */
  _createPlaceholderGraphics() {
    // Tank P1 (green)
    const graphics1 = this.add.graphics();
    graphics1.fillStyle(0x00ff00, 1);
    graphics1.fillRect(0, 0, 32, 32);
    graphics1.generateTexture('tank_p1', 32, 32);
    graphics1.destroy();

    // Tank P2 (blue)
    const graphics2 = this.add.graphics();
    graphics2.fillStyle(0x0099ff, 1);
    graphics2.fillRect(0, 0, 32, 32);
    graphics2.generateTexture('tank_p2', 32, 32);
    graphics2.destroy();

    // Wall tile (gray)
    const graphicsWall = this.add.graphics();
    graphicsWall.fillStyle(0x666666, 1);
    graphicsWall.fillRect(0, 0, 32, 32);
    graphicsWall.generateTexture('tile_wall', 32, 32);
    graphicsWall.destroy();
  }

  /**
   * Initialize enemy spawning and AI system
   * @private
   */
  _initializeEnemySystem() {
    // Level configuration (hardcoded for now)
    const levelConfig = {
      enemyCount: 15, // Level 1
      spawnPoints: [
        { x: 100, y: 50 },
        { x: 300, y: 50 },
        { x: 500, y: 50 },
        { x: 700, y: 50 }
      ]
    };

    // Initialize domain services
    this.spawnManager = new SpawnManager(
      levelConfig.enemyCount,
      levelConfig.spawnPoints
    );
    this.targetingService = new TargetingService();
    this.enemyAI = new EnemyAI(this.targetingService);

    // Initialize use cases
    this.spawnEnemy = new SpawnEnemy(
      this.spawnManager,
      this.enemyRenderer,
      this.physicsAdapter
    );
    this.updateEnemyAI = new UpdateEnemyAI(
      this.enemyAI,
      { calculateVelocity }, // MovementService.calculateVelocity
      this.enemyRenderer,
      this.projectileSystem
    );
    this.destroyEnemy = new DestroyEnemy(
      this.spawnManager,
      this.enemyRenderer,
      this.physicsAdapter,
      this.hudAdapter
    );

    // Initialize HUD with enemy count
    this.hudAdapter.updateEnemiesRemaining(this.spawnManager.getRemainingCount());
  }

  /**
   * Create player tank entities and sprites
   * @private
   * @param {Array} players - Player data from game state
   */
  _createPlayerTanks(players) {
    for (let index = 0; index < players.length; index++) {
      const playerId = `P${index + 1}`;
      const startX = 100 + (index * 600); // P1 left, P2 right
      const startY = 300;

      // Domain entity
      const tank = new Tank(playerId, { x: startX, y: startY }, 120);
      this.tanks.set(playerId, tank);

      // Phaser sprite
      const spriteKey = playerId === 'P1' ? 'tank_p1' : 'tank_p2';
      const sprite = this.physics.add.sprite(startX, startY, spriteKey);
      sprite.setCollideWorldBounds(true);

      // Register with adapters
      this.renderAdapter.registerSprite(playerId, sprite);
      this.physicsAdapter.registerEntity(playerId, sprite);
    }
  }

  /**
   * Create placeholder map with walls
   * @private
   */
  _createMap() {
    // Simple walls around the arena (800x600)
    const walls = this.physics.add.staticGroup();

    // Top wall
    const topWall = walls.create(400, 16, 'tile_wall');
    topWall.setScale(25, 1).refreshBody();
    topWall.setTint(0x808080);
    
    // Bottom wall
    const bottomWall = walls.create(400, 584, 'tile_wall');
    bottomWall.setScale(25, 1).refreshBody();
    bottomWall.setTint(0x808080);
    
    // Left wall
    const leftWall = walls.create(16, 300, 'tile_wall');
    leftWall.setScale(1, 18).refreshBody();
    leftWall.setTint(0x808080);
    
    // Right wall
    const rightWall = walls.create(784, 300, 'tile_wall');
    rightWall.setScale(1, 18).refreshBody();
    rightWall.setTint(0x808080);

    // Store walls reference for collision
    this.walls = walls;

    // Enable collision with all player tanks
    for (const [playerId] of this.tanks) {
      this.physicsAdapter.enableCollision(playerId, this.walls);
    }
  }

  /**
   * Set up projectile collisions with players and enemies
   * @private
   */
  _setupProjectileCollisions() {
    // Set up collisions between projectiles and players
    for (const [playerId, tank] of this.tanks) {
      const playerSprite = this.renderAdapter.getSprite(playerId);
      this.projectileSystem.setupProjectileCollision(playerId, playerSprite, (projectileId, targetId) => {
        // Handle player hit by enemy projectile
        console.log(`Player ${targetId} hit by projectile ${projectileId}`);
        // TODO: Implement player damage/destruction
      });
    }

    // Set up collisions between projectiles and enemies
    // Note: This will be called dynamically as enemies are spawned
    // For now, we'll handle this in the enemy spawning logic
  }

  /**
   * Game loop update
   * @param {number} time - Total elapsed time (ms)
   * @param {number} delta - Time since last frame (ms)
   */
  update(time, delta) {
    // Process each player's input and movement
    for (const [playerId, tank] of this.tanks) {
      // 1. Handle keyboard input → Direction
      const direction = this.handlePlayerInput.execute(playerId);

      // 2. Move player (updates velocity and rotation)
      this.movePlayer.execute(tank, direction);
    }

    // 3. Enemy spawning and AI
    // Spawn new enemies if needed
    const spawnedEnemy = this.spawnEnemy.execute(time);

    // Set up projectile collision for newly spawned enemy
    if (spawnedEnemy) {
      const enemySprite = this.enemyRenderer.getSprite(spawnedEnemy.id);
      this.projectileSystem.setupProjectileCollision(spawnedEnemy.id, enemySprite, (projectileId, targetId) => {
        // Handle enemy hit by player projectile
        console.log(`Enemy ${targetId} hit by projectile ${projectileId}`);
        this.destroyEnemy.execute(targetId);
      });
    }

    // Update all enemy AI
    this.updateEnemyAI.execute();

    // Update projectiles
    this.projectileSystem.update(delta);
  }  /**
   * Public API: Start game with initialization bundle
   * @param {Object} initBundle - Data from StartGame use case
   */
  start(initBundle) {
    if (!initBundle?.mode) {
      throw new Error('GameScene.start: invalid init bundle');
    }
    this.scene.start('GameScene', initBundle);
  }
}

export default GameScene;

