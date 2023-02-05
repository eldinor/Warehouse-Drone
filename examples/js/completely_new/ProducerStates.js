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
    console.log('WorkState ' + producer.name + producer.amount)

    // console.log(producer)
  }

  execute(producer) {
    if (producer.currentTime >= producer.idleDuration) {
      producer.currentTime = 0

      producer.stateMachine.changeTo(WALK)
    }
  }

  exit(producer) {}
}

// #############################################################################

class WalkState extends YUKA.State {
  enter(producer) {
    //  producer.ui.currentState.textContent = WALK

    producer.amount++
  }

  execute(producer) {
    if (producer.currentTime >= producer.walkDuration) {
      producer.currentTime = 0
      producer.stateMachine.changeTo(WORK)
    }
  }

  exit(producer) {}
}
export { WorkState, WalkState }
