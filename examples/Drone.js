import * as YUKA from '../../../../lib/yuka.module.js'

// import { IdleState, WalkState } from './States.js'

const IDLE = 'IDLE'
const WALK = 'WALK'
const BACK = 'BACK'

class Drone extends YUKA.Vehicle {
  constructor(name, warehouse) {
    super()
    this.name = name
    this.warehouse = warehouse
    this.entityAssigned = undefined

    this.maxSpeed = 5
    this.maxForce = 20

    this.amount = 0
    this.isBusy = false

    this.goUp = this.position + 1;

    this.ui = {
      currentState: document.getElementById('currentState'),
    }

    this.topUI = {
      topUI: document.getElementById('info'),
    }

    this.ui.currentState.textContent = 'Created'

    this.topUI.topUI.textContent = 'Created'

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
    //    console.log(this)
    this.stateMachine.changeTo(IDLE)
  }
  handleMessage(telegram) {
    const message = telegram.message
    console.log(telegram)

    switch (message) {
      case 'NEED TO TAKE':
        if (!this.isBusy) {
          console.log('DRONE NOT BUSY', telegram.data)
          this.steering.behaviors[0].target = telegram.data.target
          this.stateMachine.changeTo(WALK)
        }
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
  enter(drone) {
    drone.ui.currentState.textContent = IDLE

    //   drone.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log(drone.amount)

    console.log(drone)

    drone.steering.behaviors[0].active = false
    /*
    drone.steering.behaviors[0].target = new YUKA.Vector3(2, 0, 1)
    drone.steering.behaviors[0].active = false

    const path = drone.steering.behaviors[1].path
    path.clear()
    path.add(new YUKA.Vector3(-2, 0, 0))
    path.add(new YUKA.Vector3(-4, 0, 1))

    console.log(drone.path)
    */
  }

  execute(drone) {
    /*
    if (drone.currentTime >= drone.idleDuration) {
      drone.currentTime = 0
      drone.stateMachine.changeTo(WALK)
    }
    */
    /*
    const path = drone.steering.behaviors[1].path
    const lastWaypoint = path._waypoints[path._waypoints.length - 1]

    const squaredDistance = drone.position.squaredDistanceTo(lastWaypoint)
    // console.log('squaredDistance', squaredDistance)
    if (squaredDistance < 0.01) {
      //  drone.vehicle.steering.behaviors[0].active = false
      //  owner.velocity = new YUKA.Vector3(0, 0, 0)
      drone.stateMachine.changeTo(WALK)
    }
    */
  }

  exit(drone) {
    //drone.amount++
    /*
    drone.topUI.topUI.textContent =
      'Producer: ' + drone.producer.amount + ' Drone: ' + drone.amount + ' Warehouse: ' + drone.warehouse.amount
      */
  }
}

class WalkState extends YUKA.State {
  enter(drone) {
    drone.ui.currentState.textContent = 'WALK'
    drone.currentTime = 0
    //  drone.vehicle.steering.behaviors[0].active = false
    //   drone.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    drone.isBusy = true

    console.log(drone.amount)

    drone.steering.behaviors[0].active = true

    // drone.sendMessage(drone.producer, 'DRONE ASSIGNED', 0)

    //   drone.target = new YUKA.Vector3(2, 0, 4)

    /*
    drone.steering.behaviors[0].target = new YUKA.Vector3(-3, 0, -2)

    const path = drone.path
    path.clear()
    path.add(new YUKA.Vector3(0, 0, -1))
    path.add(new YUKA.Vector3(-1, 0, -2))

    console.log('WALK drone')
    console.log(drone)
    console.log(drone.path)
    */
  }

  execute(drone) {
    /*
    const path = drone.steering.behaviors[1].path
    const lastWaypoint = path._waypoints[path._waypoints.length - 1]
 */

    //  console.log(drone.position.x)
    const squaredDistance = drone.position.squaredDistanceTo(drone.steering.behaviors[0].target)
    // console.log('squaredDistance', squaredDistance)
    // console.log(drone.position.squaredDistanceTo(drone.steering.behaviors[0].target))
    if (squaredDistance < 0.02) {
      //  drone.vehicle.steering.behaviors[0].active = false
      //  owner.velocity = new YUKA.Vector3(0, 0, 0)
      drone.stateMachine.changeTo(BACK)
    }
  }

  exit(drone) {
    drone.amount = drone.entityAssigned.amount
    drone.entityAssigned.amount = 0
    /*
    drone.topUI.topUI.textContent =
      'Producer: ' + drone.producer.amount + ' Drone: ' + drone.amount + ' Warehouse: ' + drone.warehouse.amount
      */
  }
}

class BackState extends YUKA.State {
  enter(drone) {
    drone.ui.currentState.textContent = BACK
    drone.currentTime = 0
    //  drone.vehicle.steering.behaviors[0].active = false
    //   drone.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log(drone.amount)

    drone.steering.behaviors[0].target = drone.warehouse.position
    console.log(drone)
    drone.steering.behaviors[0].active = true

    //   drone.target = new YUKA.Vector3(2, 0, 4)

    /*
    drone.steering.behaviors[0].target = new YUKA.Vector3(-3, 0, -2)

    const path = drone.path
    path.clear()
    path.add(new YUKA.Vector3(0, 0, -1))
    path.add(new YUKA.Vector3(-1, 0, -2))

    console.log('WALK drone')
    console.log(drone)
    console.log(drone.path)
    */
  }

  execute(drone) {
    const squaredDistance = drone.position.squaredDistanceTo(drone.warehouse.position)
    // console.log('squaredDistance', squaredDistance)
    if (squaredDistance < 0.02) {
      //  drone.vehicle.steering.behaviors[0].active = false
      //  owner.velocity = new YUKA.Vector3(0, 0, 0)

      drone.stateMachine.changeTo(IDLE)
    }
  }

  exit(drone) {
    drone.warehouse.amount += drone.amount
    drone.amount = 0
    drone.isBusy = false
    // drone.warehouse.queue.dequeue()
    drone.entityAssigned.droneAssigned = false
    drone.entityAssigned = null
    //   drone.sendMessage(drone.producer, 'DRONE UNASSIGNED', 0)
    /*
    drone.topUI.topUI.textContent =
      'Producer: ' + drone.producer.amount + ' Drone: ' + drone.amount + ' Warehouse: ' + drone.warehouse.amount
      */
  }
}

export { Drone }
