import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './States.js'

const IDLE = 'IDLE'
const TAKE = 'TAKE'
const BACK = 'BACK'
const UP = 'UP'

export class Drone extends YUKA.Vehicle {
  constructor(name, warehouse, connectedMesh) {
    super()

    this.name = name

    this.maxSpeed = 9
    this.maxForce = 30

    this.amount = 0
    this.isBusy = false

    this.entities = []

    this.warehouse = warehouse
    this.connectedMesh = connectedMesh

    this.warehouse.entityManager.add(this)

    // let target = new YUKA.Vector3(3, 0, 2)

    const arriveBehavior = new YUKA.ArriveBehavior(warehouse.position, 2.5, 0.1)
    arriveBehavior.active = false
    this.steering.add(arriveBehavior)

    this.stateMachine = new YUKA.StateMachine(this)
    this.stateMachine.add(IDLE, new IdleState())
    this.stateMachine.add(TAKE, new TakeState())
    this.stateMachine.add(BACK, new BackState())
    this.stateMachine.add(UP, new UpState())
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
    console.log(drone.stateMachine.previousState instanceof IdleState)

    if (drone.entities[0].connectedMesh) drone.connectedMesh.material.diffuseColor = BABYLON.Color3.Yellow()
  }

  execute(drone) {
    drone.steering.behaviors[0].active = true
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
    if (drone.entities[0].connectedMesh)
      drone.entities[0].connectedMesh.material.diffuseColor = BABYLON.Color3.Magenta()
  }
}

class BackState extends YUKA.State {
  enter(drone) {
    drone.steering.behaviors[0].active = true
  }

  execute(drone) {
    drone.connectedMesh.material.diffuseColor = BABYLON.Color3.Red()
    const squaredDistance = drone.position.squaredDistanceTo(drone.steering.behaviors[0].target)
    // console.log(squaredDistance)
    if (squaredDistance < 0.1) {
      drone.stateMachine.changeTo(IDLE)
    }
  }

  exit(drone) {
    drone.warehouse.amount += drone.amount
    drone.amount = 0
    drone.entities[0].connectedMesh.material.diffuseColor = BABYLON.Color3.Purple()
    drone.isBusy = false
    drone.entities[0].droneAssigned = false

    drone.entities.pop()
    drone.connectedMesh.material.diffuseColor = BABYLON.Color3.Blue()
    // console.clear()
  }
}

class UpState extends YUKA.State {
  enter(drone) {
    console.log(drone.stateMachine.previousState instanceof IdleState)
  }

  execute(drone) {}

  exit(drone) {}
}
