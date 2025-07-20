const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;

const tiles = {
  grass: "assets/tiles/grass.png",
  dirt: "assets/tiles/dirt.png",
  wall: "assets/tiles/wall.png"
};

const loadedTiles = {};
const tileMap = [];
const itemsOnMap = [];

const player = {
  x: 1,
  y: 1,
  sprite: new Image()
};
player.sprite.src = "assets/player/player.png";

const itemSprites = {
  sword: new Image(),
  potion: new Image()
};
itemSprites.sword.src = "assets/items/sword.png";
itemSprites.potion.src = "assets/items/potion.png";

let equippedItem = null;

function generateRandomMap() {
  const width = 10;
  const height = 10;
  tileMap.length = 0;
  itemsOnMap.length = 0;

  for (let y = 0; y < height; y++) {
    tileMap[y] = [];
    for (let x = 0; x < width; x++) {
      const rand = Math.random();
      if (rand < 0.1) {
        tileMap[y][x] = "wall";
      } else if (rand < 0.3) {
        tileMap[y][x] = "dirt";
      } else {
        tileMap[y][x] = "grass";
      }
    }
  }

  for (let i = 0; i < 2; i++) {
    let rx = Math.floor(Math.random() * width);
    let ry = Math.floor(Math.random() * height);
    itemsOnMap.push({
      x: rx,
      y: ry,
      type: i % 2 === 0 ? "sword" : "potion",
      picked: false
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < tileMap.length; y++) {
    for (let x = 0; x < tileMap[y].length; x++) {
      const tile = tileMap[y][x];
      ctx.drawImage(loadedTiles[tile], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  itemsOnMap.forEach(item => {
    if (!item.picked) {
      ctx.drawImage(itemSprites[item.type], item.x * TILE_SIZE, item.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  });

  ctx.drawImage(player.sprite, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  requestAnimationFrame(draw);
}

function movePlayer(dx, dy) {
  let newX = player.x + dx;
  let newY = player.y + dy;

  if (newY < 0 || newY >= tileMap.length || newX < 0 || newX >= tileMap[0].length) {
    generateRandomMap();
    player.x = Math.floor(tileMap[0].length / 2);
    player.y = Math.floor(tileMap.length / 2);
    return;
  }

  if (tileMap[newY][newX] !== "wall") {
    player.x = newX;
    player.y = newY;

    itemsOnMap.forEach(item => {
      if (!item.picked && item.x === player.x && item.y === player.y) {
        item.picked = true;
        addToInventory(item.type);
      }
    });
  }
}

function addToInventory(itemType) {
  const inventorySlots = document.querySelectorAll("#inventory .slot");
  for (let i = 0; i < inventorySlots.length; i++) {
    if (inventorySlots[i].dataset.filled === "false") {
      inventorySlots[i].src = `assets/items/${itemType}.png`;
      inventorySlots[i].dataset.filled = "true";
      break;
    }
  }
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": movePlayer(0, -1); break;
    case "ArrowDown": movePlayer(0, 1); break;
    case "ArrowLeft": movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0); break;
  }
});

document.querySelectorAll("#inventory .slot").forEach(slot => {
  slot.addEventListener("click", () => {
    if (slot.dataset.filled === "true") {
      if (slot.classList.contains("equipped")) {
        slot.classList.remove("equipped");
        equippedItem = null;
      } else {
        document.querySelectorAll("#inventory .slot").forEach(s => s.classList.remove("equipped"));
        slot.classList.add("equipped");
        equippedItem = slot.src;
      }
    }
  });
});

player.sprite.onload = () => {
  let loadedCount = 0;
  const total = Object.keys(tiles).length;

  for (let tile in tiles) {
    const img = new Image();
    img.src = tiles[tile];
    img.onload = () => {
      loadedTiles[tile] = img;
      loadedCount++;
      if (loadedCount === total) {
        generateRandomMap();
        draw();
      }
    };
  }
};
