import * as YUKA from '../../../../lib/yuka.module.js'

import { Producer } from './Producer.js'
import { Drone } from './Drone.js'

// import { IdleState, WalkState } from './ProducerStates.js'

const IDLE = 'IDLE'
const WALK = 'WALK'

export class Warehouse extends YUKA.GameEntity {
  constructor(entityManager) {
    super()
    //   this.vehicle = vehicle

    this.amount = 0
    this.capacity = 100
    this.producers = []
    this.drones = []
    this.queue = new Queue()
    this.entityManager = entityManager

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.workDuration = 2 // duration of a single state in seconds
    this.walkDuration = 3 // duration of a single state in seconds

    this.entityManager.add(this)

    console.log('Warehouse created')

    // Populate producers
    for (let i = 0; i < 3; i++) {
      const producer = new Producer('producer_' + i, this)
      producer.amount = i
      this.producers.push(producer)
      this.entityManager.add(producer)
    }

    // Populate drones
    for (let i = 0; i < 2; i++) {
      const drone = new Drone('drone_' + i, this)
      this.drones.push(drone)
      this.entityManager.add(drone)
    }
    console.log(this)
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
  handleMessage(telegram) {
    const message = telegram.message
    console.log('WH Tel IN ', telegram)

    switch (message) {
      case 'TAKE_CARGO':
        //  this.dispatch(telegram.sender)

        return true

      default:
        console.log('telegram.message: Unknown message.')
    }
    return false
  }

  dispatchRequest(sender) {
    if (!this.queue.check(sender)) {
      this.queue.enqueue(sender)
    }
    console.log(this.queue)
    this.queue.sortqueue()

    for (let i = 0; i < this.drones.length; i++) {
      if (this.drones[i].isBusy) {
        i++
      }
      console.log(this.queue)
      sender = this.queue.dequeue(sender)
      this.drones[i].isBusy = true
      this.assignDrone(this.drones[i], sender)
      console.log(this.drones[i].name + ' TAKE_CARGO from ' + sender.name)

      return
    }
  }

  assignDrone(drone, entity) {
    // assignTo.droneAssigned = true
    console.log(drone.name + ' isAssigned to ' + entity.name)
    entity.droneAssigned = true
    drone.entityAssigned = entity
    drone.steering.behaviors[0].target = entity.position
    drone.stateMachine.changeTo(WALK)
    console.log(drone)
  }
}
class Queue {
  constructor() {
    this.queue = []
  }

  enqueue(element) {
    this.queue.push(element)
  }

  dequeue() {
    return this.queue.shift()
  }

  peek() {
    return this.queue[0]
  }
  check(element) {
    if (this.queue.includes(element)) {
      return true
    } else {
      return false
    }
  }
  sortqueue() {
    this.sort(function (x, y) {
      return y.amount - x.amount
    })
  }
}
