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

  let terrain = [];
  let buildings = [];

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
  }

  function onMouseUp (event) {
    camera.onMouseUp(event);
  }

  function onMouseMove (event) {
    camera.onMouseMove(event);
  }


  return {
    initialize, update, start, stop, onMouseDown, onMouseUp, onMouseMove,
  };
}