import * as YUKA from '../../../../lib/yuka.module.js'
import { Producer } from './Producer.js'

// import { IdleState, WalkState } from './ProducerStates.js'

const IDLE = 'IDLE'
const WORK = 'WORK'

export class Warehouse extends YUKA.GameEntity {
  constructor(entityManager) {
    super()
    this.entityManager = entityManager
    this.entityManager.add(this)
    this.amount = 0
    this.capacity = 100
    this.producers = []
    this.drones = []

    this.currentTime = 0 // tracks how long the entity is in the current state
    this.idleDuration = 2 // duration of a single state in seconds
    this.workDuration = 3 // duration of a single state in seconds

    console.log('Warehouse created')

    this.addProducer('prod_0')
    this.addProducer('prod_1')
    this.addProducer('prod_2')

    console.log(this)

    this.stateMachine = new YUKA.StateMachine(this)

    const idleState = new IdleState()

    this.stateMachine.add(IDLE, idleState)
    this.stateMachine.changeTo(IDLE)

    const workState = new WorkState()
    this.stateMachine.add(WORK, workState)
  }
  update(delta) {
    this.currentTime += delta

    this.stateMachine.update()
  }

  addProducer(name) {
    const producer = new Producer(name)
    producer.position = new YUKA.Vector3(this.getRandomInt(-5, 5), 0, this.getRandomInt(-5, 5))
    producer.amount = this.getRandomInt(0, 5)
    this.producers.push(producer)
    this.entityManager.add(producer)
    return producer
  }

  addDrone(name) {
    const drone = new Drone(name)
    drone.position = new YUKA.Vector3(this.getRandomInt(-5, 5), 0, this.getRandomInt(-5, 5))
    drone.amount = 0
    this.drones.push(drone)
    this.entityManager.add(drone)
    return drone
  }
  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  sendDrone() {
    console.log('Drone sent! ! ! ! ')
  }
}

class IdleState extends YUKA.State {
  enter(owner) {
    console.log('WAREHOUSE IDLE ENTER')
  }

  execute(owner) {
    if (owner.currentTime >= owner.idleDuration) {
      owner.currentTime = 0
      //   console.log('PRODUCER WORK END, CHANGE TO WALK')
      owner.stateMachine.changeTo(WORK)
    }
  }

  exit(owner) {}
}

// #############################################################################

class WorkState extends YUKA.State {
  enter(owner) {
    console.log('WAREHOUSE WORK ENTER')
    // console.log(owner.producers)
    /*
    owner.producers.forEach((element) => {
      element.amount
      console.log(element.stateMachine.currentState instanceof StopState)
    })
    */

    // sort by amount

    owner.pendingRequests = [...owner.producers]

    /*
    owner.pendingRequests.sort(function (x, y) {
      return y.amount - x.amount
    })
*/

    let filteredRequests = owner.pendingRequests.filter((element) => element.amount >= element.limit)

    console.log(owner.pendingRequests)
    console.log('filteredRequests ', filteredRequests)

    if (filteredRequests[0]) {
      console.log('0 IS FOUND !!!!!!!!!!!!!!!!!!!! ')

      owner.sendDrone()
    }
  }

  execute(owner) {
    if (owner.currentTime >= owner.workDuration * 1) {
      owner.currentTime = 0
      //   console.log('PRODUCER WORK END, CHANGE TO WALK')
      owner.stateMachine.changeTo(IDLE)
    }
  }

  exit(owner) {}
}
