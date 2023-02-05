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
import { createVehicle } from '../../creator.js'

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

 scene.debugLayer.show()

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    BABYLON.Tools.ToRadians (90),
    BABYLON.Tools.ToRadians(0),
    30,
    BABYLON.Vector3.Zero(),
    scene
  )

  camera.target = new BABYLON.Vector3(0, 0, 0)
  camera.attachControl(canvas, true)

  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0))

  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene)
  //ground.position.y = -1
  ground.material = new BABYLON.GridMaterial('grid', scene)

  ground.isVisible  = false

  const wareboxTop = BABYLON.MeshBuilder.CreateSphere('wareboxTop', {diameter:8}, scene)
  wareboxTop.flipFaces(true)

  const warebox= BABYLON.MeshBuilder.CreateSphere('warebox', {diameter:7}, scene)
 warebox.flipFaces(true)

  BABYLON.NodeMaterial.ParseFromSnippetAsync("R58GKR", scene).then((nodeMaterial) => {
    wareboxTop.material= nodeMaterial;

  })

  BABYLON.NodeMaterial.ParseFromSnippetAsync("6MCVHR#5", scene).then((nodeMaterial) => {
    warebox.material= nodeMaterial;

  })
  /*
    BABYLON.NodeMaterial.ParseFromSnippetAsync("#LL2HS4#6", scene).then((nodeMaterial) => {
    warebox.material= nodeMaterial;

  })

  */

  const producerMat = new BABYLON.StandardMaterial('producerMat')
  producerMat.diffuseColor = BABYLON.Color3.Purple()

  window.addEventListener('resize', onWindowResize, false)

  // YUKA specific

  entityManager = new YUKA.EntityManager()
  time = new YUKA.Time()

  warehouse = new Warehouse(entityManager, new YUKA.Vector3())

  warehouse.setRenderComponent(warebox, sync)

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);


  warebox.actionManager = new BABYLON.ActionManager(scene);
  warebox.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
            trigger: BABYLON.ActionManager.OnLeftPickTrigger,
 
        },
        function () { console.log('r button was pressed'); }
    )
);
  warehouse.producers.forEach((p) => {
  const producerBox = BABYLON.MeshBuilder.CreatePolyhedron(p.name + '_Box', { size: 1.1, type:2 }, scene)

 //  const producerBox = BABYLON.MeshBuilder.CreateSphere(p.name + '_Box', { diameter:1.2 }, scene)
    producerBox.material = producerMat.clone(p.name + '_Mat')
    p.position = new YUKA.Vector3(getRandomInt(-80, 80), getRandomInt(-80, 80), getRandomInt(-80, 80))
    p.connectedMesh = producerBox
    p.setRenderComponent(producerBox, sync)

    producerBox.actionManager = new BABYLON.ActionManager(scene);
    producerBox.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
          {
              trigger: BABYLON.ActionManager.OnLeftPickTrigger,
   
          },
          function () { console.log('sdfdfsdfsdf button was pressed'); }
      )
  );
  })

const protoVehicle = createVehicle(scene, { size: 1, y: 1 })
/*
BABYLON.NodeMaterial.ParseFromSnippetAsync("R66B6H#1", scene).then((nodeMaterial) => {
  protoVehicle.material= nodeMaterial;

})
*/

let protoMat = new BABYLON.StandardMaterial('protoMat')

protoMat.emissiveColor = BABYLON.Color3.Red()

protoMat = new BABYLON.NormalMaterial("normal", scene);


protoVehicle.material = protoMat

//
let dCounter = 0

  warehouse.drones.forEach((d) => {
    const vehicleMesh = protoVehicle.clone("drone_"+dCounter)
    dCounter++
    d.position = new YUKA.Vector3(getRandomInt(-5, 5), 0, getRandomInt(-5, 5))
    d.setRenderComponent(vehicleMesh, sync)

    vehicleMesh.actionManager = new BABYLON.ActionManager(scene);
    vehicleMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
          {
              trigger: BABYLON.ActionManager.OnLeftPickTrigger,
   
          },
          function () { console.log(d.name +" "+ d.amount); }
      )
  );
  })

  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene)

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
