import * as YUKA from '../../../../lib/yuka.module.js'

import { Producer } from './Producer.js'
import { Drone } from './Drone.js'
import { StopState } from './ProducerStates.js'

// import { IdleState, WalkState } from './ProducerStates.js'

const IDLE = 'IDLE'
const WORK = 'WORK'
const SEND = 'SEND'

export class Warehouse extends YUKA.GameEntity {
  constructor(entityManager) {
    super()

    this.amount = 0
    this.capacity = 100
    this.producers = []
    this.drones = []
    this.pendingRequests = []
    this.filteredRequests = null

    this.entityManager = entityManager

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 0.5 // duration of a single state in seconds
    this.workDuration = 3 // duration of a single state in seconds

    this.entityManager.add(this)

    this.stateMachine = new YUKA.StateMachine(this)

    const idleState = new IdleState()

    this.stateMachine.add(IDLE, idleState)
    this.stateMachine.changeTo(IDLE)

    const workState = new WorkState()
    this.stateMachine.add(WORK, workState)

    const sendState = new SendState()
    this.stateMachine.add(SEND, sendState)

    console.log('Warehouse created', this)

    //

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
  }

  update(delta) {
    this.currentTime += delta

    this.stateMachine.update()
  }
  //
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

class IdleState extends YUKA.State {
  enter(owner) {
    console.log('IDLE ENTER')
  }

  execute(owner) {
    if (owner.currentTime >= owner.idleDuration) {
      owner.currentTime = 0
      //   console.log('PRODUCER WORK END, CHANGE TO WALK')
      owner.stateMachine.changeTo(WORK)
    }
  }

  exit(owner) {}
}

// #############################################################################

class WorkState extends YUKA.State {
  enter(owner) {
    console.log('WORK ENTER')
    console.log(owner.producers)
    /*
    owner.producers.forEach((element) => {
      element.amount
      console.log(element.stateMachine.currentState instanceof StopState)
    })
    */

    // sort by amount

    owner.pendingRequests = [...owner.producers]

    owner.pendingRequests.sort(function (x, y) {
      return y.amount - x.amount
    })

    if (owner.pendingRequests[0].amount >= owner.pendingRequests[0].limit && !owner.pendingRequests[0].droneAssigned) {
      owner.stateMachine.changeTo(SEND)
    }

    /*
    owner.filteredRequests = owner.pendingRequests.find((element) => element.amount > element.limit)
    console.log('filteredRequests', filteredRequests)
    if (owner.filteredRequests) {
      owner.stateMachine.changeTo(SEND)
    }
 
    owner.drones.forEach((d) => {
      if (!d.isBusy) {
        d.isBusy = true
        console.log(d)
        if (!owner.pendingRequests[0].droneAssigned) owner.pendingRequests[0].droneAssigned = true

        owner.assignDrone(d, owner.pendingRequests[0])

        d.stateMachine.changeTo(WALK)
        owner.pendingRequests.shift()
        return
      }
    })
    */
  }

  execute(owner) {
    /*
    if (owner.currentTime >= owner.workDuration * 1) {
      owner.currentTime = 0
      //   console.log('PRODUCER WORK END, CHANGE TO WALK')
      owner.stateMachine.changeTo(IDLE)
    }
    */
  }

  exit(owner) {}
}

class SendState extends YUKA.State {
  enter(owner) {
    console.log('SendState ENTER')
    let freeDrone = owner.drones.find((element) => !element.isBusy)
    console.log(freeDrone)
    freeDrone.isBusy = true
    owner.pendingRequests[0].droneAssigned = true
    freeDrone.entity = owner.pendingRequests[0]
    freeDrone.entityAssigned = owner.pendingRequests[0]
    //   owner.pendingRequests = []
    freeDrone.stateMachine.changeTo('WALK')
  }

  execute(owner) {
    owner.stateMachine.changeTo(IDLE)
  }

  exit(owner) {}
}
