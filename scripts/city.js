export function createCity (size) {
  const data = [];

  initialize();

  function initialize () {
    for (let i = 0; i < size; i++) {
      const columns = [];
      for (let j = 0; j < size; j++) {
        const tile = {
          i, j, building: undefined, update () {
            const x = Math.random();
            if (x < 0.01) {
              if (this.building === undefined) {
                this.building = 'building-1';
              } else if (this.building === 'building-1') {
                this.building = 'building-2';
              } else if (this.building === 'building-2') {
                this.building = 'building-3';
              }
            }
          },
        };
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