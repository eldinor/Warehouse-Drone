import * as YUKA from '../../../../lib/yuka.module.js'

import { WorkState, WalkState, StopState } from './ProducerStates.js'

const WORK = 'WORK'
const WALK = 'WALK'
const STOP = 'STOP'

export class Producer extends YUKA.GameEntity {
  constructor(name, warehouse) {
    super()
    this.name = name
    this.warehouse = warehouse
    console.log('Producer created')
    this.amount = 0
    this.capacity = 4
    this.limit = 2
    this.droneAssigned = false
    this
    //  this.time = time

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.workDuration = 2 // duration of a single state in seconds
    this.walkDuration = 1 // duration of a single state in seconds

    this.stateMachine = new YUKA.StateMachine(this)

    const idleState = new WorkState()

    this.stateMachine.add(WORK, idleState)
    this.stateMachine.changeTo(WORK)

    const walkState = new WalkState()
    this.stateMachine.add(WALK, walkState)

    const stopState = new StopState()
    this.stateMachine.add(STOP, stopState)
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
        console.log('DRONE ASSIGNED ggg')
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
