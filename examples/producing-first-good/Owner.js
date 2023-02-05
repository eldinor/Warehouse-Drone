import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './States.js'

const IDLE = 'IDLE'
const WALK = 'WALK'
const BACK = 'BACK'

class Owner extends YUKA.Vehicle {
  constructor() {
    super()

    // this.vehicle = vehicle

    this.maxSpeed = 5
    this.maxForce = 20

    this.amount = 0

    this.ui = {
      currentState: document.getElementById('currentState'),
    }
    this.ui.currentState.textContent = 'Created'
    // let target = new YUKA.Vector3(3, 0, 2)
    let target = new YUKA.Vector3(1, 0, 4)
    const arriveBehavior = new YUKA.ArriveBehavior(target, 2.5, 0.1)
    arriveBehavior.active = false
    this.steering.add(arriveBehavior)
    /*
    const path = new YUKA.Path()
    path.loop = false

    this.path = path

    const followPathBehavior = new YUKA.FollowPathBehavior(path, 1.5)
    followPathBehavior.active = true
    this.steering.add(followPathBehavior)
*/
    this.stateMachine = new YUKA.StateMachine(this)
    this.stateMachine.add(IDLE, new IdleState())
    this.stateMachine.add(WALK, new WalkState())
    this.stateMachine.add(BACK, new BackState())
    console.log(this)
    this.stateMachine.changeTo(IDLE)
  }
  handleMessage(telegram) {
    const message = telegram.message
    console.log(telegram)

    switch (message) {
      case 'NEED TO TAKE':
        console.log('DRONE READY', telegram.data)

        this.steering.behaviors[0].target = telegram.data.target
        this.stateMachine.changeTo(WALK)

        //  this.stateMachine.changeTo('DRONEWALK')
        //   let ggg = { target: producer.position }
        //   this.sendMessage(this.drones[0], 'NEED TO TAKE', 0, ggg)

        return true

      default:
        console.log('telegram.message: Unknown message.')
    }
    return false
  }
}

class IdleState extends YUKA.State {
  enter(girl) {
    girl.ui.currentState.textContent = IDLE

    //   girl.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log(girl.amount)

    console.log(girl)

    girl.steering.behaviors[0].active = false
    /*
    girl.steering.behaviors[0].target = new YUKA.Vector3(2, 0, 1)
    girl.steering.behaviors[0].active = false

    const path = girl.steering.behaviors[1].path
    path.clear()
    path.add(new YUKA.Vector3(-2, 0, 0))
    path.add(new YUKA.Vector3(-4, 0, 1))

    console.log(girl.path)
    */
  }

  execute(girl) {
    /*
    if (girl.currentTime >= girl.idleDuration) {
      girl.currentTime = 0
      girl.stateMachine.changeTo(WALK)
    }
    */
    /*
    const path = girl.steering.behaviors[1].path
    const lastWaypoint = path._waypoints[path._waypoints.length - 1]

    const squaredDistance = girl.position.squaredDistanceTo(lastWaypoint)
    // console.log('squaredDistance', squaredDistance)
    if (squaredDistance < 0.01) {
      //  girl.vehicle.steering.behaviors[0].active = false
      //  owner.velocity = new YUKA.Vector3(0, 0, 0)
      girl.stateMachine.changeTo(WALK)
    }
    */
  }

  exit(girl) {
    girl.amount++
  }
}

class WalkState extends YUKA.State {
  enter(girl) {
    girl.ui.currentState.textContent = WALK
    girl.currentTime = 0
    //  girl.vehicle.steering.behaviors[0].active = false
    //   girl.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log(girl.amount)

    girl.steering.behaviors[0].active = true
    //   girl.target = new YUKA.Vector3(2, 0, 4)

    /*
    girl.steering.behaviors[0].target = new YUKA.Vector3(-3, 0, -2)

    const path = girl.path
    path.clear()
    path.add(new YUKA.Vector3(0, 0, -1))
    path.add(new YUKA.Vector3(-1, 0, -2))

    console.log('WALK GIRL')
    console.log(girl)
    console.log(girl.path)
    */
  }

  execute(girl) {
    /*
    const path = girl.steering.behaviors[1].path
    const lastWaypoint = path._waypoints[path._waypoints.length - 1]
 */
    const squaredDistance = girl.position.squaredDistanceTo(girl.steering.behaviors[0].target)
    // console.log('squaredDistance', squaredDistance)
    if (squaredDistance < 0.01) {
      //  girl.vehicle.steering.behaviors[0].active = false
      //  owner.velocity = new YUKA.Vector3(0, 0, 0)
      girl.stateMachine.changeTo(BACK)
    }
  }

  exit(girl) {}
}

class BackState extends YUKA.State {
  enter(girl) {
    girl.ui.currentState.textContent = BACK
    girl.currentTime = 0
    //  girl.vehicle.steering.behaviors[0].active = false
    //   girl.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log(girl.amount)
    girl.amount = girl.warehouse.amount
    girl.producer.amount = 0
    girl.steering.behaviors[0].target = girl.warehouse.position
    girl.steering.behaviors[0].active = true
    //   girl.target = new YUKA.Vector3(2, 0, 4)

    /*
    girl.steering.behaviors[0].target = new YUKA.Vector3(-3, 0, -2)

    const path = girl.path
    path.clear()
    path.add(new YUKA.Vector3(0, 0, -1))
    path.add(new YUKA.Vector3(-1, 0, -2))

    console.log('WALK GIRL')
    console.log(girl)
    console.log(girl.path)
    */
  }

  execute(girl) {
    /*
    const path = girl.steering.behaviors[1].path
    const lastWaypoint = path._waypoints[path._waypoints.length - 1]

    const squaredDistance = girl.position.squaredDistanceTo(lastWaypoint)
    // console.log('squaredDistance', squaredDistance)
    if (squaredDistance < 0.01) {
      //  girl.vehicle.steering.behaviors[0].active = false
      //  owner.velocity = new YUKA.Vector3(0, 0, 0)
      girl.stateMachine.changeTo(IDLE)
    }
    */
  }

  exit(girl) {}
}

export { Owner }
