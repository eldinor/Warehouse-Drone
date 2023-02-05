import * as YUKA from '../../../../lib/yuka.module.js'
// import * as DAT from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.module.js';

import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
// import 'https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js'
// import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'

import { Owner } from './Owner.js'
import { Producer } from './Producer.js'
import { Warehouse } from './Warehouse.js'

let engine, scene
let entityManager, time, vehicle, target, owner, producer, warehouse

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

  const vehicleMesh = BABYLON.MeshBuilder.CreateCylinder(
    'cone',
    { height: 2, diameterTop: 0, diameterBottom: 1 },
    scene
  )
  vehicleMesh.rotation.x = Math.PI * 0.5
  vehicleMesh.bakeCurrentTransformIntoVertices()
  /*
  scene.onPointerMove = () => {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY)
    if (pickResult?.pickedPoint) {
      target.x = pickResult.pickedPoint.x
      target.y = pickResult.pickedPoint.y
      target.z = pickResult.pickedPoint.z
    }
  }
*/
  window.addEventListener('resize', onWindowResize, false)

  // YUKA specific
  target = new YUKA.Vector3()

  entityManager = new YUKA.EntityManager()
  time = new YUKA.Time()

  owner = new Owner()
  owner.setRenderComponent(vehicleMesh, sync)

  producer = new Producer()
  producer.position = new YUKA.Vector3(3, 0, -2)
  const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene)
  producer.setRenderComponent(box, sync)

  warehouse = new Warehouse()
  warehouse.position = new YUKA.Vector3(-3, 0, 4)
  const warebox = BABYLON.MeshBuilder.CreateBox('warebox', { size: 2 }, scene)
  warehouse.setRenderComponent(warebox, sync)
  warehouse.producers.push(producer)
  warehouse.drones.push(owner)
  owner.warehouse = warehouse
  owner.producer = producer

  producer.warehouse = warehouse
  //
  entityManager.add(owner)
  entityManager.add(producer)
  entityManager.add(warehouse)

  console.log(entityManager.entities[0].stateMachine)
}

function onWindowResize() {
  engine.resize()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = time.update().getDelta()
  entityManager.update(delta)
  owner.stateMachine.update(delta)
  // producer.stateMachine.update(delta)
  // producer.currentTime += delta
  // entityManager.entities[0].stateMachine.update(delta)
  scene.render()
}

function sync(entity, renderComponent) {
  entity.worldMatrix.toArray(entityMatrix.m)
  entityMatrix.markAsUpdated()

  const matrix = renderComponent.getWorldMatrix()
  matrix.copyFrom(entityMatrix)
}
