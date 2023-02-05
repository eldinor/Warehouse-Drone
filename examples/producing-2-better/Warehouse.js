import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './ProducerStates.js'

const IDLE = 'IDLE'
const WALK = 'WALK'

export class Warehouse extends YUKA.GameEntity {
  constructor() {
    super()
    //   this.vehicle = vehicle

    this.amount = 0
    this.capacity = 100
    this.producers = []
    this.drones = []

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 2 // duration of a single state in seconds
    this.walkDuration = 3 // duration of a single state in seconds

    console.log('Warehouse created')
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
    console.log('WH Tel ', telegram)

    switch (message) {
      case 'ADDED AMOUNT':
        console.log('RECEIVED!!', telegram.data.target)
        //  this.stateMachine.changeTo('DRONEWALK')
        let ggg = { target: telegram.data.target }
        this.sendMessage(this.drones[0], 'NEED TO TAKE', 0, ggg)

        return true

      default:
        console.log('telegram.message: Unknown message.')
    }
    return false
  }
}
