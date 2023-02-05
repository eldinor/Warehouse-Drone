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
    this.capacity = 10
    this.limit = 3
    this.droneAssigned = false

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.workDuration = 2 // duration of a single state in seconds
    this.walkDuration = 1 // duration of a single state in seconds

    this.stateMachine = new YUKA.StateMachine(this)

    const workState = new WorkState()

    this.stateMachine.add(WORK, workState)
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
}
