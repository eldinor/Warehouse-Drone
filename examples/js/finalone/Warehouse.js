import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './ProducerStates.js'

import { Producer } from './Producer.js'
import { Drone } from './Drone.js'

const IDLE = 'IDLE'
const CHECK = 'CHECK'

export class Warehouse extends YUKA.GameEntity {
  constructor(entityManager) {
    super()
    this.entityManager = entityManager
    this.entityManager.add(this)
    this.amount = 0
    this.capacity = 100
    this.producers = []
    this.drones = []

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 1 // duration of a single state in seconds
    this.checkDuration = 1 // duration of a single state in seconds

    console.log('Warehouse created')
    console.log(this)

    this.stateMachine = new YUKA.StateMachine(this)

    this.stateMachine.add(IDLE, new IdleState())
    this.stateMachine.changeTo(IDLE)

    this.stateMachine.add(CHECK, new CheckState())

    this.addProducer('prod_0')
    this.addProducer('prod_1')
    this.addProducer('prod_2')

    this.addDrone('drone_0')
    this.addDrone('drone_1')
  }
  update(delta) {
    this.currentTime += delta

    this.stateMachine.update()
  }
  addProducer(name) {
    const producer = new Producer(name)
    producer.position = new YUKA.Vector3(this.getRandomInt(-5, 5), 0, this.getRandomInt(-5, 5))
    producer.amount = this.getRandomInt(0, 5)
    this.producers.push(producer)
    this.entityManager.add(producer)
    return producer
  }

  addDrone(name) {
    const drone = new Drone(name)
    drone.position = new YUKA.Vector3(this.getRandomInt(-5, 5), 0, this.getRandomInt(-5, 5))
    drone.amount = 0
    this.drones.push(drone)
    this.entityManager.add(drone)
    return drone
  }

  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
//#####################################@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
class IdleState extends YUKA.State {
  enter(owner) {
    console.log('WAREHOUSE IDLE ENTER')
  }

  execute(owner) {
    if (owner.currentTime >= owner.idleDuration) {
      owner.currentTime = 0
      //   console.log('PRODUCER WORK END, CHANGE TO WALK')
      owner.stateMachine.changeTo(CHECK)
    }
  }

  exit(owner) {}
}

// #############################################################################
class CheckState extends YUKA.State {
  enter(owner) {
    console.log('WAREHOUSE CheckState ENTER')
    let freeDrone = owner.drones.find((element) => !element.isBusy)

    console.log(freeDrone.name)

    let nonAssignedProducers = owner.producers.filter((element) => !element.droneAssigned)
    console.log(nonAssignedProducers)

    let exceededProducers = nonAssignedProducers.filter((element) => element.amount > element.limit)

    console.log('exceededProducers', exceededProducers)
    if (freeDrone) {
      if (exceededProducers[0]) {
        let toAssign = exceededProducers[0]
        exceededProducers[0].droneAssigned = true
        freeDrone.entity = exceededProducers[0]
      }
    }
  }

  execute(owner) {
    if (owner.currentTime >= owner.checkDuration) {
      owner.currentTime = 0
      //   console.log('PRODUCER WORK END, CHANGE TO WALK')
      owner.stateMachine.changeTo(IDLE)
    }
  }

  exit(owner) {}
}

// #############################################################################
