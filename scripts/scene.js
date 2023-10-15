import * as THREE from 'three';
import { createCamera } from './camera.js';

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
        // Grass geometry
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({color: 0x00aa00});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(i, -0.5, j);
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
        // Building geometry
        const tile = city.data[i][j];
        if (tile.building && tile.building.startsWith('building')) {
          const height = Number(tile.building.slice(-1));
          const buildingGeometry = new THREE.BoxGeometry(1, height, 1);
          const buildingMaterial = new THREE.MeshLambertMaterial({color: 0x777777});
          const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
          buildingMesh.position.set(i, height / 2, j);

          if (buildings[i][j]) scene.remove(buildings[i][j]);

          scene.add(buildingMesh);
          buildings[i][j] = buildingMesh;
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