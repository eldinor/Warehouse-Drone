import * as YUKA from '../../../../lib/yuka.module.js'
// import * as DAT from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.module.js';

import 'https://preview.babylonjs.com/babylon.js'
import 'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js'
// import 'https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js'
// import 'https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js'
/*
import { Drone } from './Drone.js'
import { Producer } from './Producer.js'
*/
import { createVehicle } from '../creator.js'

import { Warehouse } from './Warehouse.js'

// import { BaseSystem } from './BaseSystem.js'

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

  // scene.debugLayer.show()

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
  //ground.position.y = -1
  ground.material = new BABYLON.GridMaterial('grid', scene)

  const warebox = BABYLON.MeshBuilder.CreateBox('warebox', { size: 2 }, scene)

  const producerMat = new BABYLON.StandardMaterial('producerMat')
  producerMat.diffuseColor = BABYLON.Color3.Purple()

  const droneMat = new BABYLON.StandardMaterial('droneMat')
  droneMat.diffuseColor = BABYLON.Color3.Blue()

  const builderMat = new BABYLON.StandardMaterial('builderMat')
  builderMat.diffuseColor = BABYLON.Color3.Red()

  window.addEventListener('resize', onWindowResize, false)

  // YUKA specific

  entityManager = new YUKA.EntityManager()
  time = new YUKA.Time()

  warehouse = new Warehouse(entityManager, new YUKA.Vector3(0, 0, 0)) //new YUKA.Vector3(-9, -0.5, -1))

  warehouse.setRenderComponent(warebox, sync)

  warehouse.producers.forEach((p) => {
    const producerBox = BABYLON.MeshBuilder.CreateBox(p.name + '_Box', { size: 1 }, scene)
    producerBox.material = producerMat.clone(p.name + '_Mat')
    p.position = new YUKA.Vector3(getRandomInt(-15, 15) * 2, 0, getRandomInt(-15, 15) * 2)
    p.connectedMesh = producerBox
    p.setRenderComponent(producerBox, sync)
  })

  warehouse.drones.forEach((d) => {
    const vehicleMesh = createVehicle(scene, { size: 1, y: 1 })
    vehicleMesh.material = droneMat.clone(d.name + '_Mat')
    d.position = new YUKA.Vector3(getRandomInt(-5, 5), 0, getRandomInt(-5, 5))
    d.connectedMesh = vehicleMesh
    d.setRenderComponent(vehicleMesh, sync)
  })

  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene)
  /*
  const cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', { height: 1, diameter: 0.8 }, scene)
  cylinder.material = builderMat

  warehouse.builders[0].connectedMesh = cylinder
  warehouse.builders[0].position = new YUKA.Vector3(getRandomInt(-5, 5), 0, getRandomInt(-5, 5))
  warehouse.builders[0].setRenderComponent(cylinder, sync)
*/
  //
}

function onWindowResize() {
  engine.resize()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = time.update().getDelta()
  entityManager.update(delta)

  warehouse.drones.forEach((d) => {
    d.stateMachine.update(delta)
  })

  warehouse.topleft.producerlist.textContent = warehouse.amount
  /*
    warehouse.stateMachine.update(delta)

  warehouse.drones.forEach((d) => {
    d.stateMachine.update(delta)
  })
  */
  // drone.stateMachine.update(delta)
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

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function aniProd(from, to) {
  let aniBox = BABYLON.MeshBuilder.CreateBox('aniBox', { size: 2 }, scene)

  let anim = BABYLON.Animation.CreateAndStartAnimation('anim', aniBox, 'position', 30, 120, from, to, 0)
}
