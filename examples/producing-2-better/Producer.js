import * as YUKA from '../../../../lib/yuka.module.js'

import { IdleState, WalkState } from './ProducerStates.js'

const IDLE = 'IDLE'
const WALK = 'WALK'

export class Producer extends YUKA.GameEntity {
  constructor() {
    super()
    //   this.vehicle = vehicle
    console.log('Producer created')
    this.amount = 0
    this.capacity = 20
    this.droneAssigned = false
    //  this.time = time

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 2 // duration of a single state in seconds
    this.walkDuration = 1 // duration of a single state in seconds

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

  handleMessage(telegram) {
    const message = telegram.message
    console.log(telegram)

    switch (message) {
      case 'DRONE ASSIGNED':
        console.log('DRONE ASSIGNED')
        this.droneAssigned = true
        return true
      case 'DRONE UNASSIGNED':
        console.log('DRONE UNASSIGNED')
        this.droneAssigned = false
        return true
      default:
        console.log('telegram.message: Unknown message.')
    }
    return false
  }
}
