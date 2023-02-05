/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author modified at https://github.com/eldinor/yuka-babylonjs-examples
 */

import * as YUKA from '../../../../lib/yuka.module.js'

const IDLE = 'IDLE'
const WALK = 'WALK'

class IdleState extends YUKA.State {
  enter(producer) {
    //  producer.ui.currentState.textContent = IDLE

    //   producer.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    console.log('Producer amount', producer.amount)

    console.log(producer)
  }

  execute(producer) {
    //  console.log(producer.currentTime)
    if (producer.currentTime >= producer.idleDuration) {
      producer.currentTime = 0
      console.log('IDLE END, CHANGE TO WALK')
      producer.stateMachine.changeTo(WALK)
    }
  }

  exit(producer) {}
}

// #############################################################################

class WalkState extends YUKA.State {
  enter(producer) {
    //  producer.ui.currentState.textContent = WALK
    //  producer.meshToManage.material.diffuseColor = BABYLON.Color3.Red()

    producer.amount++

    if (producer.amount > 2 && !producer.droneAssigned) {
      let ggg = { am: producer.amount, target: producer.position }
      producer.sendMessage(producer.warehouse, 'ADDED AMOUNT', 0, ggg)
    }

    //  console.log(producer.steering.behaviors[0])

    // const followPathBehavior = new YUKA.FollowPathBehavior(producer.path, 0.5)
    // producer.steering.add(followPathBehavior)
  }

  execute(producer) {
    if (producer.currentTime >= producer.walkDuration) {
      producer.currentTime = 0
      producer.stateMachine.changeTo(IDLE)
    }
  }

  exit(producer) {}
}
export { IdleState, WalkState }
