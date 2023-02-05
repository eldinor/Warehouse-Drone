/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author modified at https://github.com/eldinor/yuka-babylonjs-examples
 */

import * as YUKA from '../../../../lib/yuka.module.js'

const WORK = 'WORK'
const WALK = 'WALK'
const STOP = 'STOP'

class WorkState extends YUKA.State {
  enter(producer) {
    //  producer.ui.currentState.textContent = IDLE

    //   producer.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log(producer.name + ' amount', producer.amount)
    if (producer.amount >= producer.capacity) {
      producer.stateMachine.changeTo(STOP)
    }
  }

  execute(producer) {
    //  console.log(producer.currentTime)
    if (producer.currentTime >= producer.workDuration) {
      producer.currentTime = 0
      console.log('PRODUCER WORK END, CHANGE TO WALK')
      producer.stateMachine.changeTo(WALK)
    }
  }

  exit(producer) {
    producer.amount++
  }
}

// #############################################################################

class WalkState extends YUKA.State {
  enter(producer) {
    //  producer.ui.currentState.textContent = WALK
    //  producer.meshToManage.material.diffuseColor = BABYLON.Color3.Red()
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    /*
    if (!producer.droneAssigned) {
      if (producer.amount >= producer.limit) {
        producer.warehouse.dispatchRequest(producer)
        console.log(producer.name + ' dispatchRequest ')
        //   producer.sendMessage(producer.warehouse, 'TAKE_CARGO', 0)
        //   console.log(producer)
      }
    }
*/
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //  console.log(producer.steering.behaviors[0])
    // const followPathBehavior = new YUKA.FollowPathBehavior(producer.path, 0.5)
    // producer.steering.add(followPathBehavior)
  }

  execute(producer) {
    if (producer.currentTime >= producer.walkDuration) {
      producer.currentTime = 0
      producer.stateMachine.changeTo(WORK)
    }
  }

  exit(producer) {}
}
// #############################################################################

class StopState extends YUKA.State {
  enter(producer) {
    console.log('PRODUCER STOP STATE')
    /*
    setTimeout(() => {
      producer.amount = 0
    }, 2000)
    */
    //  producer.ui.currentState.textContent = WALK
    //  producer.meshToManage.material.diffuseColor = BABYLON.Color3.Red()

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    /*
    if (producer.amount > 2 && !producer.droneAssigned) {
      let ggg = { am: producer.amount, target: producer.position }
      producer.sendMessage(producer.warehouse, 'ADDED AMOUNT', 0, ggg)
    }
    */
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //  console.log(producer.steering.behaviors[0])

    // const followPathBehavior = new YUKA.FollowPathBehavior(producer.path, 0.5)
    // producer.steering.add(followPathBehavior)
  }

  execute(producer) {
    if (producer.amount < producer.capacity) {
      producer.stateMachine.changeTo(WORK)
    }
    /*
    if (!producer.droneAssigned) {
      if (producer.amount >= producer.limit) {
        producer.warehouse.dispatchRequest(producer)
      }
    }
    */
  }

  exit(producer) {}
}
export { WorkState, WalkState, StopState }
