import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(1, 1, 1);

const assets = {
  'grass': (x, y) => {
    const material = new THREE.MeshLambertMaterial({color: 0x339933});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {id: 'grass', x, y};
    mesh.position.set(x, -0.5, y);
    return mesh;
  },
  'residential': (x, y) => {
    const material = new THREE.MeshLambertMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {id: 'residential', x, y};
    mesh.position.set(x, 0.5, y);
    return mesh;
  },
  'commercial': (x, y) => {
    const material = new THREE.MeshLambertMaterial({color: 0x0000ff});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {id: 'commercial', x, y};
    mesh.position.set(x, 0.5, y);
    return mesh;
  },
  'industrial': (x, y) => {
    const material = new THREE.MeshLambertMaterial({color: 0xffff00});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {id: 'industrial', x, y};
    mesh.position.set(x, 0.5, y);
    return mesh;
  },
  'road': (x, y) => {
    const material = new THREE.MeshLambertMaterial({color: 0x444440});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = {id: 'road', x, y};
    mesh.scale.set(1, 0.1, 1);
    mesh.position.set(x, 0.05, y);
    return mesh;
  },
};

export function createAssetInstance (assetId, x, y) {
  if (assetId in assets) {
    return assets[assetId](x, y);
  } else {
    console.warn(`Asset is ${assetId} not found.`);
    return undefined;
  }
}