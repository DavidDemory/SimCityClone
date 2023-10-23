export function createCity (size) {
  const data = [];

  initialize();

  function initialize () {
    for (let i = 0; i < size; i++) {
      const columns = [];
      for (let j = 0; j < size; j++) {
        const tile = createTile(i, j);
        columns.push(tile);
      }
      data.push(columns);
    }
  }

  function update () {
    console.log(`Updating city`);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        data[i][j].update();
      }
    }
  }

  return {
    size, data, update,
  };
}

function createTile (i, j) {
  return {
    i, j, terrainId: 'grass', buildingId: undefined,
    update () {
    },
  };
}