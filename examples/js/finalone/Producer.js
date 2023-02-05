import * as YUKA from '../../../../lib/yuka.module.js'

import { WorkState, WalkState } from './ProducerStates.js'

const WORK = 'WORK'
const WALK = 'WALK'
const STOP = 'STOP'

export class Producer extends YUKA.GameEntity {
  constructor(name) {
    super()
    //   this.vehicle = vehicle
    this.name = name
    console.log('Producer created')
    this.amount = 0
    this.limit = 4
    this.capacity = 20
    this.droneAssigned = false
    //  this.time = time

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 2 // duration of a single state in seconds
    this.walkDuration = 1 // duration of a single state in seconds

    this.stateMachine = new YUKA.StateMachine(this)

    const workState = new WorkState()

    this.stateMachine.add(WORK, workState)
    this.stateMachine.changeTo(WORK)

    const walkState = new WalkState()
    this.stateMachine.add(WALK, walkState)
  }
  update(delta) {
    this.currentTime += delta

    this.stateMachine.update()
  }
}
