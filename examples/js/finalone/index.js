import * as YUKA from '../../../../lib/yuka.module.js'
// import * as DAT from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.module.js';

import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
// import 'https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js'
// import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'
import { createVehicle } from '../creator.js'
import { Warehouse } from './Warehouse.js'

let engine, scene
let entityManager, time, vehicle, target, drone, producer, warehouse

const entityMatrix = new BABYLON.Matrix()

init()
animate()

function init() {
  const canvas = document.getElementById('renderCanvas')
  engine = new BABYLON.Engine(canvas, true, {}, true)

  scene = new BABYLON.Scene(engine)
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)
  scene.useRightHandedSystem = true

  //scene.debugLayer.show()

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    BABYLON.Tools.ToRadians(90),
    BABYLON.Tools.ToRadians(0),
    30,
    BABYLON.Vector3.Zero(),
    scene
  )

  camera.target = new BABYLON.Vector3(0, 0, 0)
  camera.attachControl(canvas, true)

  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0))

  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 40, height: 20 }, scene)
  ground.position.y = -1
  ground.material = new BABYLON.GridMaterial('grid', scene)

  window.addEventListener('resize', onWindowResize, false)

  // YUKA specific
  target = new YUKA.Vector3()

  entityManager = new YUKA.EntityManager()
  time = new YUKA.Time()

  const warebox = BABYLON.MeshBuilder.CreateBox('warebox', { size: 2 }, scene)

  warehouse = new Warehouse(entityManager)
  warehouse.position = new YUKA.Vector3(-9, -1, -1)
  warehouse.setRenderComponent(warebox, sync)

  warehouse.producers.forEach((p) => {
    const producerBox = BABYLON.MeshBuilder.CreateBox(p.name + '_Box', { size: 1 }, scene)
    p.position = new YUKA.Vector3(getRandomInt(-5, 5), 0, getRandomInt(-5, 5))
    p.setRenderComponent(producerBox, sync)
  })

  warehouse.drones.forEach((d) => {
    const vehicleMesh = createVehicle(scene, { size: 1, y: 1 })
    d.setRenderComponent(vehicleMesh, sync)
  })
}

function onWindowResize() {
  engine.resize()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = time.update().getDelta()
  entityManager.update(delta)
  //drone.stateMachine.update(delta)
  // producer.stateMachine.update(delta)
  // producer.currentTime += delta
  // entityManager.entities[0].stateMachine.update(delta)
  /*
  drone.topUI.topUI.textContent =
    'Producer: ' +
    producer.stateMachine.currentState.constructor.name +
    ' ' +
    drone.producer.amount +
    ' Drone: ' +
    drone.amount +
    ' Warehouse: ' +
    drone.warehouse.amount
*/
  scene.render()
}

function sync(entity, renderComponent) {
  entity.worldMatrix.toArray(entityMatrix.m)
  entityMatrix.markAsUpdated()

  const matrix = renderComponent.getWorldMatrix()
  matrix.copyFrom(entityMatrix)
}
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
