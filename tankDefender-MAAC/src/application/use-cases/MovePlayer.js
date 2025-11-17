/**
 * MovePlayer Use Case
 * 
 * Updates tank velocity and rotation based on direction using physics and renderer ports.
 * 
 * @module application/use-cases/MovePlayer
 */

import { calculateVelocity, directionToAngle } from '../../domain/services/MovementService.js';

/**
 * @typedef {'up' | 'down' | 'left' | 'right' | 'idle'} Direction
 * @typedef {import('../ports/IPhysics.js').IPhysics} IPhysics
 * @typedef {import('../ports/IRenderer.js').IRenderer} IRenderer
 * @typedef {import('../../domain/entities/Tank.js').default} Tank
 */

/**
 * MovePlayer Use Case Class
 * 
 * @implements {function}
 */
class MovePlayer {
  /**
   * Create MovePlayer use case
   * @param {IPhysics} physicsPort - Physics port implementation
   * @param {IRenderer} renderPort - Renderer port implementation
   */
  constructor(physicsPort, renderPort) {
    if (!physicsPort || typeof physicsPort.setVelocity !== 'function') {
      throw new Error('MovePlayer: physicsPort must implement IPhysics interface');
    }

    if (!renderPort || typeof renderPort.setRotation !== 'function') {
      throw new Error('MovePlayer: renderPort must implement IRenderer interface');
    }

    this.physicsPort = physicsPort;
    this.renderPort = renderPort;
  }

  /**
   * Execute movement for a tank
   * @param {Tank} tank - Tank entity to move
   * @param {Direction} direction - Movement direction
   * @returns {void}
   */
  execute(tank, direction) {
    // Validate inputs
    if (!tank || !tank.id) {
      throw new Error('MovePlayer: tank must be a valid Tank entity');
    }

    const validDirections = ['up', 'down', 'left', 'right', 'idle'];
    if (!validDirections.includes(direction)) {
      throw new Error(`MovePlayer: invalid direction "${direction}"`);
    }

    // Calculate velocity from direction and tank speed
    const velocity = calculateVelocity(direction, tank.speed);

    // Update physics velocity
    this.physicsPort.setVelocity(tank.id, velocity);

    // Update sprite rotation (unless stopped)
    if (direction !== 'idle') {
      const angle = directionToAngle(direction);
      if (angle !== null) {
        this.renderPort.setRotation(tank.id, angle);
      }
    }

    // Update tank's internal direction state
    tank.setDirection(direction);
  }
}

export default MovePlayer;
