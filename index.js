//--Initial----------------------------------------------------------------------------------------------------------------------------------------//
window.oncontextmenu = (e) => {
  e.preventDefault();
};
window.onresize = resize;
window.onload = initLoad;
let highscores;

function initLoad() {
  resize();
  loadImages();
  loadMenuEvents();
  startBackgroundLoop();

  try {
    highscores = JSON.parse(localStorage.getItem("highscores"));
    if (!highscores) {
      localStorage.setItem("highscores", "[]");
      highscores = [];
    }
  } catch {
    localStorage.setItem("highscores", "[]");
    highscores = [];
  }

  document.querySelector(".loadingScreen").style.display = "none";
  document.querySelector("#mainMenu").style.display = "block";
  game.started = false;
  game.over = false;
}
function resize() {
  let backgroundCanvas = document.querySelector("#backgroundCanvas");
  backgroundCanvas.height = window.innerHeight;
  backgroundCanvas.width = window.innerWidth;

  let gameCanvas = document.querySelector("#gameCanvas");
  gameCanvas.height = window.innerHeight;
  gameCanvas.width = window.innerWidth;

  if (game.started) {
    if (gameLoopRunning) {
      pausedText.style.display = "block";
      backgroundLoopRunning = false;
      gameLoopRunning = false;
    }
    let ctx = gameCanvas.getContext("2d");
    drawGame(ctx);
  }
  drawBackground();
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function loadImages() {
  let dog = new Image();
  dog.src = "images/moon.png";
  let skyscraperHead = new Image();
  skyscraperHead.src = "images/skyscraper-head.png";
  let skyscraperBody = new Image();
  skyscraperBody.src = "images/skyscraper-body.png";
  game.images = [skyscraperBody, skyscraperHead, dog];

  let player1 = new Image();
  player1.src = "images/cosmiqs.png";
  let player2 = new Image();
  player2.src = "images/cosmiqs.png";
  let player3 = new Image();
  player3.src = "images/cosmiqs.png";
  player.images = [player1, player2, player3];
}

//--Background-------------------------------------------------------------------------------------------------------------------------------------//
let backgroundLoopRunning = false,
  city = [],
  clouds = [];
function startBackgroundLoop() {
  backgroundLoopRunning = true;
  let currBackTime, prevBackTime;
  window.requestAnimationFrame((currTime) => {
    currBackTime = currTime;
    prevBackTime = currTime;
    backgroundLoop(currBackTime, prevBackTime);
  });
}
function backgroundLoop(currTime, prevTime) {
  if (backgroundLoopRunning) {
    let elapsedTime = currTime - prevTime;
    if (elapsedTime > 16) {
      prevTime = currTime;
      if (clouds.length === 0) {
        for (let i = 0; i < 10; i++) {
          let newCloudIndex = random(1, 2);
          let cloudImage = new Image();
          cloudImage.src = "images/cloud" + newCloudIndex + ".png";

          let newCloud = {};
          newCloud.y = random(0, window.innerHeight * 0.5);
          newCloud.x = random(0, window.innerWidth);
          newCloud.s = random(1, 5);
          newCloud.i = cloudImage;
          clouds.push(newCloud);
        }
      } else {
        for (let i = 0; i < clouds.length; i++) {
          clouds[i].x -= (window.innerWidth * 0.001 * (10 + clouds[i].s)) / 10;
          if (clouds[i].x < -window.innerWidth * 0.1) clouds.splice(i, 1);
        }
        if (clouds.length < 10) {
          let newCloudIndex = random(1, 2);
          let cloudImage = new Image();
          cloudImage.src = "images/cloud" + newCloudIndex + ".png";

          let newCloud = {};
          newCloud.y = random(0, window.innerHeight * 0.5);
          newCloud.x = window.innerWidth;
          newCloud.s = random(1, 5);
          newCloud.i = cloudImage;
          clouds.push(newCloud);
        }
      }

      let cityHeight = 0.2;
      let cityWidth = cityHeight * 1.35;
      if (city.length === 0) {
        let initNum = window.innerWidth / window.innerHeight / cityWidth;
        for (let i = 0; i < initNum; i++) {
          let cityImg = new Image();
          cityImg.src = "images/city.png";
          city.push({
            i: cityImg,
            x: i * cityWidth,
          });
        }
      } else {
        for (let i = 0; i < city.length; i++) {
          city[i].x -= (window.innerWidth * 0.001) / window.innerHeight;
          if (
            city[i].x <
            (-window.innerHeight * 0.2 * 1.35) / window.innerHeight
          )
            city.splice(i, 1);
        }
        if (city.length < 10) {
          let cityImg = new Image();
          cityImg.src = "images/city.png";
          let newCity = {};
          newCity.i = cityImg;
          newCity.x = city[city.length - 1].x + 0.2 * 1.35;
          city.push(newCity);
        }
      }
      drawBackground();
    }
    window.requestAnimationFrame((currTime) => {
      backgroundLoop(currTime, prevTime);
    });
  }
}
function drawBackground() {
  let backgroundCanvas = document.querySelector("#backgroundCanvas");
  let ctx = backgroundCanvas.getContext("2d");
  ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

  let cloudWidth = window.innerHeight * 0.15;
  let cloudHeight = cloudWidth / 3.85;
  for (let i = 0; i < clouds.length; i++) {
    ctx.drawImage(
      clouds[i].i,
      clouds[i].x,
      clouds[i].y,
      cloudWidth,
      cloudHeight
    );
  }
  if (city.length > 0) {
    let cityHeight = window.innerHeight * 0.2;
    let cityWidth = cityHeight * 1.35;
    let cityY = window.innerHeight * 0.8;
    for (let i = 0; i < city.length; i++) {
      let cityX = window.innerHeight * city[i].x;
      ctx.drawImage(city[i].i, cityX, cityY, cityWidth, cityHeight);
    }
  }
}

//--Menu-------------------------------------------------------------------------------------------------------------------------------------------//
function loadMenuEvents() {
  let name = document.querySelector("#name");
  let scores = document.querySelector("#scores");
  let mainMenu = document.querySelector("#mainMenu");
  let nameField = document.querySelector("#nameField");
  let gameWindow = document.querySelector(".gameWindow");
  let gameOverWindow = document.querySelector("#gameOverWindow");

  document.querySelector("#scoreboard").onclick = () => {
    mainMenu.style.display = "none";
    scores.style.display = "block";
    displayHighscores(highscores);
  };
  document.querySelector("#backS").onclick = () => {
    mainMenu.style.display = "block";
    scores.style.display = "none";
  };
  document.querySelector("#startGame").onclick = () => {
    mainMenu.style.display = "none";
    name.style.display = "block";
  };
  document.querySelector("#confirm").onclick = () => {
    if (!nameField.value) alert("You must input a name!");
    else {
      player.name = nameField.value;
      gameWindow.style.display = "block";
      mainMenu.style.display = "none";
      name.style.display = "none";
      nameField.value = "";
      initGame();
    }
  };
  document.querySelector("#backN").onclick = () => {
    mainMenu.style.display = "block";
    name.style.display = "none";
  };
  document.querySelector("#gameR").onclick = () => {
    gameOverWindow.style.display = "none";
    game.over = false;
    initGame();
  };
  document.querySelector("#gameM").onclick = () => {
    gameOverWindow.style.display = "none";
    gameWindow.style.display = "none";
    mainMenu.style.display = "block";
    game.over = false;
    startBackgroundLoop();
  };
}
function displayHighscores(highscores) {
  let scoreHolder = document.querySelector(".scoreHolder");
  while (scoreHolder.children.length > 0)
    scoreHolder.removeChild(scoreHolder.lastChild);
  for (let i = 0; i < highscores.length; i++) {
    let newScore = document.createElement("div");
    let name = highscores[i].name;
    if (name.length > 10) name = name.slice(0, 10);
    newScore.innerText = name + " : " + highscores[i].score;
    newScore.className = "score";
    scoreHolder.appendChild(newScore);
  }
  if (highscores.length === 0) {
    let scoreNotify = document.createElement("div");
    scoreNotify.innerText = "No highscores";
    scoreNotify.className = "scoreNotify";
    scoreHolder.appendChild(scoreNotify);
  }
}

//--Game-------------------------------------------------------------------------------------------------------------------------------------------//
let gameLoopRunning = false,
  game = {},
  player = {};
function initGame() {
  game.adjustLeft = 0;
  game.obstacles = [];
  game.coins = [];
  game.tick = 0;

  backgroundLoopRunning = false;
  player.y = window.innerHeight * 0.4;
  player.score = 0;
  player.angle = 0;
  player.tick = 1;
  player.dir = 1;
  player.x = 100;
  player.f = 0;

  document.querySelector(".gameScore").innerText = player.score;
  document.querySelector("#gameInfo").style.display = "block";
  let gameCanvas = document.querySelector("#gameCanvas");
  let ctx = gameCanvas.getContext("2d");
  drawGame(ctx);
}
function startGameLoop() {
  document.querySelector("#gameInfo").style.display = "none";
  let gameCanvas = document.querySelector("#gameCanvas");
  let ctx = gameCanvas.getContext("2d");

  game.started = true;
  startBackgroundLoop();
  gameLoopRunning = true;
  let currGameTime, prevGameTime;
  window.requestAnimationFrame((currTime) => {
    currGameTime = currTime;
    prevGameTime = currTime;
    gameLoop(currGameTime, prevGameTime, ctx);
  });
}
function gameLoop(currTime, prevTime, ctx) {
  if (gameLoopRunning) {
    let elapsedTime = currTime - prevTime;
    if (elapsedTime > 16) {
      prevTime = currTime;
      updateGame(elapsedTime);
      drawGame(ctx);
      collision();
    }
    window.requestAnimationFrame((currTime) => {
      gameLoop(currTime, prevTime, ctx);
    });
  }
}
function updateGame(elapsedTime) {
  game.tick++;
  if (game.tick >= 100) game.tick = 0;
  if (game.tick % 5 === 0) {
    player.tick += player.dir;
    if (player.tick > 2) player.dir = -1;
    else if (player.tick < 2) player.dir = 1;
  }
  if (game.tick % 50 === 0) {
    let pipeSet = random(2, 6);
    let pipeTop = random(1, 9 - pipeSet);
    let posX = screen.width * 1.1 + game.adjustLeft;
    game.obstacles.push({
      pipeSet: pipeSet,
      pipeTop: pipeTop,
      x: posX,
    });
    game.coins.push({
      y: pipeTop + pipeSet / 2,
      x: posX,
    });
  }
  let behindPlayer = game.adjustLeft - window.innerHeight * 0.1 * 0.95 + 100;
  if (game.obstacles.length > 0) {
    if (game.obstacles[0].x < behindPlayer - 100) game.obstacles.splice(0, 1);
  }
  if (game.coins.length > 0) {
    if (game.coins[0].x < behindPlayer - 100) game.coins.splice(0, 1);
  }

  let distX = elapsedTime / 2;
  game.adjustLeft += distX;
  player.x += distX;

  let gravity = window.innerHeight * 0.0005;
  player.y += gravity + player.f;
  player.f += gravity;

  if (player.angle < Math.PI / 2) player.angle += Math.PI / 72;
  if (player.angle > Math.PI / 2) player.angle = Math.PI / 2;
}
function drawGame(ctx) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  let playerImg = player.images[player.tick - 1];
  let playerWidth = window.innerHeight * 0.1 * 0.95;
  let playerHeight = playerWidth / 1.58;
  let blockHeight = playerWidth / 0.95;

  ctx.beginPath();
  ctx.save();
  ctx.translate(
    player.x - game.adjustLeft + playerWidth * 0.75,
    player.y + playerHeight * 0.75
  );
  ctx.rotate(player.angle);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    playerImg,
    -playerWidth * 0.75,
    -playerHeight * 0.75,
    playerWidth * 1.5,
    playerHeight * 1.5
  );
  ctx.restore();
  ctx.closePath();

  for (let i = 0; i < game.obstacles.length; i++) {
    let obs = game.obstacles[i];
    let gap = (window.innerHeight * obs.pipeSet) / 10;
    let height1 = (window.innerHeight * obs.pipeTop) / 10;
    let height2 = window.innerHeight - height1 - gap;
    let headHeight = playerWidth / 9.85;
    let howMuchTop = height1 / blockHeight;
    let howMuchBottom = height2 / blockHeight;

    for (let j = 0; j < howMuchTop; j++) {
      ctx.beginPath();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        game.images[0],
        obs.x - game.adjustLeft,
        j * blockHeight,
        playerWidth,
        blockHeight
      );
      ctx.closePath();
    }
    ctx.beginPath();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      game.images[1],
      obs.x - game.adjustLeft,
      height1 - headHeight,
      playerWidth,
      headHeight
    );
    ctx.closePath();

    for (let j = 0; j < howMuchBottom; j++) {
      ctx.beginPath();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        game.images[0],
        obs.x - game.adjustLeft,
        height1 + gap + j * blockHeight,
        playerWidth,
        blockHeight
      );
      ctx.closePath();
    }
    ctx.beginPath();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      game.images[1],
      obs.x - game.adjustLeft,
      height1 + gap,
      playerWidth,
      headHeight
    );
    ctx.closePath();
  }
  for (let i = 0; i < game.coins.length; i++) {
    let dog = game.coins[i];
    let height = (window.innerHeight * dog.y) / 10 - playerWidth / 2;

    ctx.beginPath();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      game.images[2],
      dog.x - game.adjustLeft,
      height,
      playerWidth,
      playerWidth
    );
    ctx.closePath();
  }
}
function collision() {
  if (player.y > window.innerHeight) gameOver();
  if (player.y < -window.innerHeight * 0.05)
    player.y = -window.innerHeight * 0.05;
  let playerWidth = window.innerHeight * 0.1 * 0.95;
  let playerHeight = playerWidth / 1.58;

  if (game.coins.length > 0) {
    let playerX = player.x - game.adjustLeft + playerWidth / 2;
    let playerY = player.y + playerHeight / 2;
    let playerR = playerWidth * 0.35;

    let dog = game.coins[0];
    let dogX = dog.x - game.adjustLeft + playerWidth / 2;
    let dogY = (window.innerHeight * dog.y) / 10;
    let dogR = playerWidth / 2;

    let dist = Math.sqrt(
      Math.pow(playerX - dogX, 2) + Math.pow(playerY - dogY, 2)
    );
    if (dist < playerR + dogR) {
      game.coins.splice(0, 1);
      player.score++;
      document.querySelector(".gameScore").innerText = player.score;
    }
  }
  if (game.obstacles.length > 0) {
    let obs = game.obstacles[0];
    let gap = (window.innerHeight * obs.pipeSet) / 10;
    let height1 = (window.innerHeight * obs.pipeTop) / 10;
    let height2 = window.innerHeight - height1 - gap;

    let playerCircle = {
      x: player.x - game.adjustLeft + playerWidth / 2,
      y: player.y + playerHeight / 2,
      r: playerWidth * 0.35,
    };
    let obsRect1 = {
      x: obs.x - game.adjustLeft,
      y: 0,
      w: playerWidth,
      h: height1,
    };
    let obsRect2 = {
      x: obs.x - game.adjustLeft,
      y: height1 + gap,
      w: playerWidth,
      h: height2,
    };
    if (
      rectCircleCollision(playerCircle, obsRect1) ||
      rectCircleCollision(playerCircle, obsRect2)
    )
      gameOver();
  }
}
function rectCircleCollision(circle, rect) {
  let distX = Math.abs(circle.x - rect.x - rect.w / 2);
  let distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > rect.w / 2 + circle.r) return false;
  if (distY > rect.h / 2 + circle.r) return false;
  if (distX <= rect.w / 2) return true;
  if (distY <= rect.h / 2) return true;

  let dx = distX - rect.w / 2;
  let dy = distY - rect.h / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}
function jump() {
  if (gameLoopRunning) {
    let gravity = window.innerHeight * 0.0005;
    player.f = -20 * gravity;
    player.angle = -Math.PI * 0.4;
  }
}
function pause() {
  let pausedText = document.querySelector("#pausedText");
  if (gameLoopRunning) {
    pausedText.style.display = "block";
    backgroundLoopRunning = false;
    gameLoopRunning = false;
  } else {
    pausedText.style.display = "none";
    startBackgroundLoop();
    startGameLoop();
  }
}
function gameOver() {
  game.over = true;
  game.started = false;
  gameLoopRunning = false;
  backgroundLoopRunning = false;
  document.querySelector("#gameOverWindow").style.display = "block";
  saveHighscore({ name: player.name, score: player.score });
}
function saveHighscore(newScore) {
  let placedIn = false,
    highscoresChanged = false,
    nameFound = false;
  for (let i = 0; i < highscores.length; i++) {
    if (highscores[i].name == newScore.name) {
      nameFound = true;
      if (newScore.score > highscores[i].score) {
        highscores[i].score = newScore.score;
        highscoresChanged = true;
        highscores = highscores.sort((a, b) => {
          return b.score - a.score;
        });
        break;
      }
    }
  }
  if (!highscoresChanged && !nameFound) {
    for (let i = 0; i < highscores.length; i++) {
      if (newScore.score >= highscores[i].score) {
        highscores.splice(i, 0, newScore);
        if (highscores.length > 5) highscores.splice(5, 1);
        highscoresChanged = true;
        placedIn = true;
        break;
      }
    }
  }
  if (!placedIn && highscores.length < 5 && !nameFound) {
    highscores.push(newScore);
    highscoresChanged = true;
  }
  if (highscoresChanged)
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

//--Keyboard---------------------------------------------------------------------------------------------------------------------------------------//
window.onkeydown = (e) => {
  if (!game.started && !backgroundLoopRunning && !game.over && e.key === " ")
    startGameLoop();
  else if (game.started) {
    switch (e.key) {
      default:
        break;
      case " ":
        jump();
        break;
      case "p":
        pause();
        break;
      case "P":
        pause();
        break;
    }
  }
};
