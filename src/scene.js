import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createAssetInstance } from './assets.js';

export function createScene () {
  const gameWindow = document.getElementById('render-target');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = undefined;

  let terrain = [];
  let buildings = [];

  let onObjectSelected = undefined;

  function initialize (city) {
    scene.clear();
    terrain = [];
    buildings = [];
    for (let i = 0; i < city.size; i++) {
      const columns = [];
      for (let j = 0; j < city.size; j++) {
        const terrainId = city.data[i][j].terrainId;
        const mesh = createAssetInstance(terrainId, i, j);
        scene.add(mesh);
        columns.push(mesh);
      }
      terrain = [...terrain, columns];
      buildings = [...buildings, [...Array(city.size)]];
    }

    setUpLights();
  }

  function update (city) {
    for (let i = 0; i < city.size; i++) {
      for (let j = 0; j < city.size; j++) {
        const currentBuildingId = buildings[i][j]?.userData.id;
        const newBuildingId = city.data[i][j].buildingId;
        // If the player removes a building
        if (!newBuildingId && currentBuildingId) {
          scene.remove(buildings[i][j]);
          buildings[i][j] = undefined;
        }
        // If the data model has changed
        if (newBuildingId !== currentBuildingId) {
          scene.remove(buildings[i][j]);
          buildings[i][j] = createAssetInstance(newBuildingId, i, j);
          scene.add(buildings[i][j]);
        }
      }
    }
  }

  function setUpLights () {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
    ];

    lights[1].position.set(0, 1, 0);
    lights[2].position.set(1, 1, 0);
    lights[3].position.set(0, 1, 1);

    scene.add(...lights);
  }

  function draw () {
    renderer.render(scene, camera.camera);
  }

  function start () {
    renderer.setAnimationLoop(draw);
  }

  function stop () {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown (event) {
    camera.onMouseDown(event);

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      if (selectedObject) selectedObject.material.emissive.setHex(0);
      selectedObject = intersections[0].object;
      selectedObject.material.emissive.setHex(0x555555);

      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject);
      }
    }
  }

  function onMouseUp (event) {
    camera.onMouseUp(event);
  }

  function onMouseMove (event) {
    camera.onMouseMove(event);
  }


  return {
    onObjectSelected, initialize, update, start, stop, onMouseDown, onMouseUp, onMouseMove,
  };
}