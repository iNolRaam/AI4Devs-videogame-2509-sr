// SpawnManager Service (ENEMY-2)
// Manages enemy spawning lifecycle: reserve tracking, active enemies, spawn limits, timing

export default class SpawnManager {
  /**
   * Creates a SpawnManager instance
   * @param {Object} config - Configuration object
   * @param {number} config.totalReserve - Total enemies available to spawn
   * @param {number} config.maxSimultaneous - Maximum enemies active at once (default: 4)
   * @param {number} config.spawnDelay - Milliseconds between spawns (default: 2000)
   * @param {Array} config.spawnPoints - Array of spawn point coordinates [{x,y}, ...]
   */
  constructor(config = {}) {
    if (!config.totalReserve || config.totalReserve < 0) {
      throw new Error('SpawnManager: totalReserve must be a positive number');
    }
    if (!config.spawnPoints || !Array.isArray(config.spawnPoints) || config.spawnPoints.length === 0) {
      throw new Error('SpawnManager: spawnPoints must be a non-empty array');
    }

    this.totalReserve = config.totalReserve;
    this.remainingReserve = config.totalReserve;
    this.activeEnemies = [];
    this.maxSimultaneous = config.maxSimultaneous || 4;
    this.spawnPoints = [...config.spawnPoints]; // Copy array
    this.spawnDelay = config.spawnDelay || 2000;
    this.lastSpawnTime = -this.spawnDelay; // Allow first spawn at time 0
  }

  /**
   * Checks if an enemy can be spawned at the given time
   * @param {number} currentTime - Current game time in milliseconds
   * @returns {boolean} True if spawning is allowed
   */
  canSpawn(currentTime) {
    return (
      this.remainingReserve > 0 &&
      this.activeEnemies.length < this.maxSimultaneous &&
      (currentTime - this.lastSpawnTime) >= this.spawnDelay
    );
  }

  /**
   * Gets a random spawn point from the configured spawn points
   * @returns {Object} Random spawn point {x, y}
   */
  getRandomSpawnPoint() {
    const randomIndex = Math.floor(Math.random() * this.spawnPoints.length);
    return { ...this.spawnPoints[randomIndex] }; // Return copy
  }

  /**
   * Spawns a new enemy and adds it to the active list
   * @param {number} currentTime - Current game time in milliseconds
   * @returns {Object|null} New enemy object or null if cannot spawn
   */
  spawnEnemy(currentTime) {
    if (!this.canSpawn(currentTime)) {
      return null;
    }

    const spawnPoint = this.getRandomSpawnPoint();
    const enemyType = this._determineEnemyType();

    // Create enemy with unique ID
    const enemyId = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const enemy = {
      id: enemyId,
      spawnPosition: spawnPoint,
      type: enemyType,
      spawnedAt: currentTime
    };

    // Update state
    this.remainingReserve--;
    this.activeEnemies.push(enemy);
    this.lastSpawnTime = currentTime;

    return enemy;
  }

  /**
   * Removes an enemy from the active list
   * @param {string} enemyId - ID of the enemy to remove
   * @returns {boolean} True if enemy was found and removed
   */
  removeEnemy(enemyId) {
    if (typeof enemyId !== 'string') {
      throw new Error('SpawnManager: enemyId must be a string');
    }

    const index = this.activeEnemies.findIndex(enemy => enemy.id === enemyId);
    if (index === -1) {
      return false;
    }

    this.activeEnemies.splice(index, 1);
    return true;
  }

  /**
   * Gets the total remaining enemies (reserve + active)
   * @returns {number} Total remaining enemy count
   */
  getRemainingCount() {
    return this.remainingReserve + this.activeEnemies.length;
  }

  /**
   * Determines enemy type based on probability distribution
   * @returns {string} 'regular' (75%) or 'fast' (25%)
   * @private
   */
  _determineEnemyType() {
    // 75% regular, 25% fast
    return Math.random() < 0.75 ? 'regular' : 'fast';
  }

  /**
   * Gets current state for debugging/testing
   * @returns {Object} Current state snapshot
   */
  getState() {
    return {
      totalReserve: this.totalReserve,
      remainingReserve: this.remainingReserve,
      activeCount: this.activeEnemies.length,
      maxSimultaneous: this.maxSimultaneous,
      lastSpawnTime: this.lastSpawnTime,
      spawnDelay: this.spawnDelay,
      canSpawn: this.canSpawn(Date.now())
    };
  }
}