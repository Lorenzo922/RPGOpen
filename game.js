const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;

const tiles = {
  grass: "assets/tiles/grass.png",
  dirt: "assets/tiles/dirt.png",
  wall: "assets/tiles/wall.png"
};

const tileMap = [
  ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
  ["grass", "dirt", "dirt", "dirt", "grass", "dirt", "dirt", "dirt", "dirt", "grass"],
  ["grass", "dirt", "wall", "dirt", "grass", "dirt", "wall", "wall", "dirt", "grass"],
  ["grass", "dirt", "dirt", "dirt", "grass", "dirt", "dirt", "dirt", "dirt", "grass"],
  ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
  ["grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "grass"],
  ["grass", "dirt", "wall", "dirt", "wall", "dirt", "wall", "dirt", "wall", "grass"],
  ["grass", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "dirt", "grass"],
  ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
  ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
];

const player = {
  x: 1,
  y: 1,
  sprite: new Image()
};
player.sprite.src = "assets/player/player.png";

const itemsOnMap = [
  { x: 3, y: 1, type: "sword", picked: false },
  { x: 6, y: 6, type: "potion", picked: false }
];

const itemSprites = {
  sword: new Image(),
  potion: new Image()
};
itemSprites.sword.src = "assets/items/sword.png";
itemSprites.potion.src = "assets/items/potion.png";

const loadedTiles = {};

function loadTiles(callback) {
  let loadedCount = 0;
  const total = Object.keys(tiles).length;

  for (let tile in tiles) {
    const img = new Image();
    img.src = tiles[tile];
    img.onload = () => {
      loadedTiles[tile] = img;
      loadedCount++;
      if (loadedCount === total) callback();
    };
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // desenha o mapa
  for (let y = 0; y < tileMap.length; y++) {
    for (let x = 0; x < tileMap[y].length; x++) {
      const tile = tileMap[y][x];
      ctx.drawImage(loadedTiles[tile], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  // desenha os itens
  itemsOnMap.forEach(item => {
    if (!item.picked) {
      ctx.drawImage(itemSprites[item.type], item.x * TILE_SIZE, item.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  });

  // desenha o jogador
  ctx.drawImage(player.sprite, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  requestAnimationFrame(draw);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newY < 0 || newY >= tileMap.length || newX < 0 || newX >= tileMap[0].length) return;
  if (tileMap[newY][newX] !== "wall") {
    player.x = newX;
    player.y = newY;

    // checa se há item no local
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

player.sprite.onload = () => {
  loadTiles(draw);
};
