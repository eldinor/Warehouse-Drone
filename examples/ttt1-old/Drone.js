import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './States.js'

const IDLE = 'IDLE'
const TAKE = 'TAKE'
const BACK = 'BACK'

export class Drone extends YUKA.Vehicle {
  constructor(name, warehouse) {
    super()

    this.name = name

    this.maxSpeed = 5
    this.maxForce = 20

    this.amount = 0
    this.isBusy = false

    this.entities = []

    this.warehouse = warehouse

    this.warehouse.entityManager.add(this)

    // let target = new YUKA.Vector3(3, 0, 2)

    const arriveBehavior = new YUKA.ArriveBehavior(warehouse.position, 2.5, 0.1)
    arriveBehavior.active = false
    this.steering.add(arriveBehavior)

    this.stateMachine = new YUKA.StateMachine(this)
    this.stateMachine.add(IDLE, new IdleState())
    this.stateMachine.add(TAKE, new TakeState())
    this.stateMachine.add(BACK, new BackState())
    this.stateMachine.changeTo(IDLE)
  }
}

class IdleState extends YUKA.State {
  enter(drone) {
    drone.velocity = new YUKA.Vector3(0, 0, 0)
    drone.steering.behaviors[0].active = false
  }

  execute(drone) {}

  exit(drone) {}
}

class TakeState extends YUKA.State {
  enter(drone) {
    drone.steering.behaviors[0].active = true
  }

  execute(drone) {
    const squaredDistance = drone.position.squaredDistanceTo(drone.entities[0].position)
    //  console.log(squaredDistance)
    if (squaredDistance < 0.1) {
      drone.stateMachine.changeTo(BACK)
    }
  }

  exit(drone) {
    drone.steering.behaviors[0].target = drone.warehouse.position
    drone.amount = drone.entities[0].amount
    drone.entities[0].amount = 0
  }
}

class BackState extends YUKA.State {
  enter(drone) {
    drone.steering.behaviors[0].active = true
  }

  execute(drone) {
    const squaredDistance = drone.position.squaredDistanceTo(drone.steering.behaviors[0].target)
    // console.log(squaredDistance)
    if (squaredDistance < 0.1) {
      drone.stateMachine.changeTo(IDLE)
    }
  }

  exit(drone) {
    drone.warehouse.amount += drone.amount
    drone.amount = 0
    drone.isBusy = false
    drone.entities[0].droneAssigned = false
    drone.entities.pop()
  }
}
