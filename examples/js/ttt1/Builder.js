import * as YUKA from '../../../../lib/yuka.module.js'
// import 'https://preview.babylonjs.com/babylon.js'
import { Producer } from './Producer.js'
const WORK = 'WORK'
const WALK = 'WALK'
const TAKE = 'TAKE'
const ASK = 'ASK'
const STOP = 'STOP'

export class Builder extends Producer {
  constructor(name, warehouse, connectedMesh) {
    super()
    //   this.vehicle = vehicle
    this.name = name
    this.warehouse = warehouse
    this.connectedMesh = connectedMesh

    this.need = -50

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.workDuration = 2 + Math.random() / 2 // duration of a single state in seconds
    this.walkDuration = 1 + Math.random() // duration of a single state in seconds

    this.stateMachine = new YUKA.StateMachine(this)

    this.stateMachine.add(ASK, new AskState())
    this.stateMachine.changeTo(ASK)

    this.stateMachine.add(WALK, new WalkState())

    console.log('Builder created', this)
  }
  update(delta) {
    this.currentTime += delta

    this.stateMachine.update()
  }
}

class AskState extends YUKA.State {
  enter(builder) {
    console.log('ENTER AskState')
    if (builder.need < 0 && !builder.droneAssigned) {
      let freeDrone = builder.warehouse.drones.find((element) => !element.isBusy)
      if (freeDrone) {
        builder.droneAssigned = true
        freeDrone.isBusy = true
        freeDrone.entities[0] = builder
        freeDrone.steering.behaviors[0].target = builder.position
        //   console.log('target', freeDrone.steering.behaviors[0].target)
        if (builder.connectedMesh) builder.connectedMesh.material.diffuseColor = BABYLON.Color3.Green()
        freeDrone.stateMachine.changeTo(TAKE)
      }
    }
  }

  execute(builder) {
    /*
    if (builder.currentTime >= builder.workDuration) {
      builder.currentTime = 0
      console.log('AskState END, CHANGE TO WALK')
      builder.stateMachine.changeTo(WALK)
    }
    */
  }

  exit(builder) {}
}
class WalkState extends YUKA.State {
  enter(builder) {
    //  console.log(producer)
  }

  execute(producer) {}

  exit(producer) {}
}
