import * as YUKA from '../../../../lib/yuka.module.js'
import { Warehouse } from './Warehouse.js'

class BaseSystem {
  constructor() {
    console.log('BaseSystem created')
    this.warehouse = new Warehouse()
    console.log(this)
  }
}

export { BaseSystem }
