const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;

const tiles = {
  grass: "assets/tiles/grass.png",
  dirt: "assets/tiles/dirt.png",
  wall: "assets/tiles/wall.png"
};

const tileMap = [
  ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
  ["grass", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass"],
  ["grass", "dirt", "wall", "dirt", "grass", "grass", "grass", "grass", "dirt", "wall", "dirt", "grass", "grass", "grass", "grass", "dirt", "wall", "dirt", "grass", "grass"],
  ["grass", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass"],
  ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
];

const player = {
  x: 1,
  y: 1,
  sprite: new Image()
};

player.sprite.src = "assets/player/player.png";

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

  // desenha o jogador
  ctx.drawImage(player.sprite, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  requestAnimationFrame(draw);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  // Verifica se está dentro do mapa
  if (newY < 0 || newY >= tileMap.length || newX < 0 || newX >= tileMap[0].length) return;

  // Verifica se é parede
  if (tileMap[newY][newX] !== "wall") {
    player.x = newX;
    player.y = newY;
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

loadTiles(draw);
