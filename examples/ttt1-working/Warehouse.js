import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './ProducerStates.js'
import { Producer } from './Producer.js'
import { Drone } from './Drone.js'
const IDLE = 'IDLE'
const WALK = 'WALK'

export class Warehouse extends YUKA.GameEntity {
  constructor(entityManager, position) {
    super()
    this.entityManager = entityManager
    this.entityManager.add(this)

    this.position = position

    this.amount = 0
    this.capacity = 100
    this.producers = []
    this.drones = []

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 1 // duration of a single state in seconds
    this.walkDuration = 1 // duration of a single state in seconds

    this.aniiProd = null

    console.log('Warehouse created')

    

    this.topleft = {
      producerlist: document.getElementById('producerlist'),
    }

    console.log(this)
    

    // Populate producers
    for (let i = 0; i < 450; i++) {
      const producer = new Producer('producer_' + i, this)
      producer.amount = i
      this.producers.push(producer)
      this.entityManager.add(producer)
    }
    // Populate drones
    for (let i = 0; i < 250; i++) {
      const drone = new Drone('drone_' + i, this)
      this.drones.push(drone)
      this.entityManager.add(drone)
    }
    /*
    this.stateMachine = new YUKA.StateMachine(this)

    const idleState = new IdleState()

    this.stateMachine.add(IDLE, idleState)
    this.stateMachine.changeTo(IDLE)

    const walkState = new WalkState()
    this.stateMachine.add(WALK, walkState)
  }
  update(delta) {
    this.currentTime += delta

    this.stateMachine.update()
  }
  */
  }
}
