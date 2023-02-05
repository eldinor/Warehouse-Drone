import * as YUKA from '../../../../lib/yuka.module.js'
// import 'https://preview.babylonjs.com/babylon.js'
const WORK = 'WORK'
const WALK = 'WALK'
const TAKE = 'TAKE'
const STOP = 'STOP'



export class Producer extends YUKA.GameEntity {
  constructor(name, warehouse, connectedMesh) {
    super()
    //   this.vehicle = vehicle
    this.name = name
    this.warehouse = warehouse
    this.connectedMesh = connectedMesh

    this.parent = warehouse

    this.amount = 0
    this.limit = 4
    this.capacity = 20
    this.droneAssigned = false
    this.animation = []

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.workDuration = 2 + Math.random() / 2 // duration of a single state in seconds
    this.walkDuration = 1 + Math.random() // duration of a single state in seconds

    this.stateMachine = new YUKA.StateMachine(this)

    const workState = new WorkState()

    this.stateMachine.add(WORK, workState)
    this.stateMachine.changeTo(WORK)

    const walkState = new WalkState()
    this.stateMachine.add(WALK, walkState)

   console.log('Producer created', this)

   const timeCreated = Date.now()

  this.alpha = 0
  }
  update(delta) {
    this.currentTime += delta
// console.log(this.alpha)
  //  this.position.x += (Math.cos(this.alpha) /500)
  //  this.position.z += (Math.sin(this.alpha) /500)
//  this.warehouse.rotation.set(0,this.alpha,0,1).normalize() 

    this.stateMachine.update()
    this.alpha +=0.001
  }
}

class WorkState extends YUKA.State {
  enter(producer) {}

  execute(producer) {
    if (producer.currentTime >= producer.workDuration) {
      producer.currentTime = 0
   //   console.log('WorkState END, CHANGE TO WALK')
      producer.stateMachine.changeTo(WALK)
    }
  }

  exit(producer) {}
}
class WalkState extends YUKA.State {
  enter(producer) {
    producer.amount++

 //   console.log(producer.name, ' amount ', producer.amount)

    if (producer.amount > producer.limit && !producer.droneAssigned) {
   //   console.log('Limit EXCEED', producer.name)
      producer.connectedMesh.material.diffuseColor = BABYLON.Color3.Teal()
      let freeDrone = producer.warehouse.drones.find((element) => !element.isBusy)

   //   console.log(freeDrone)

      if (freeDrone) {
        producer.droneAssigned = true
        freeDrone.isBusy = true
        freeDrone.entities[0] = producer
        freeDrone.steering.behaviors[0].target = producer.position
     //   console.log('target', freeDrone.steering.behaviors[0].target)
        producer.connectedMesh.material.diffuseColor = BABYLON.Color3.Green()
        freeDrone.stateMachine.changeTo("TAKE")
      }
    }

    //  console.log(producer)
  }

  execute(producer) {
    //  console.log(producer.currentTime)
    if (producer.currentTime >= producer.walkDuration) {
      producer.currentTime = 0
    //  console.log('WalkState END, CHANGE TO WORK')
      producer.stateMachine.changeTo(WORK)
    }
  }

  exit(producer) {
   // producer.position.x +=0.1
  }
}
