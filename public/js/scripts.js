const socket = io();

const BALLOONS = {};

function clearSlimeBalloon(username, message) {
  
}

socket.on('join', (slime) => {
  const game = document.getElementById('game');

  game.innerHTML += `<div class="slime" id="${slime.username}"><h1>${slime.username}</h1></div>`;

  BALLOONS[slime.username] = '';
});

socket.on('chatBalloon', (balloon) => {
  const slime = document.getElementById(balloon.username);
  slime.innerHTML = `<h1>${balloon.username}: ${balloon.message}</h1>`;
  BALLOONS[balloon.username] = balloon.message;

  setTimeout((username = balloon.username, message = balloon.message) => {
    if (BALLOONS[username] === message) {
      const slime = document.getElementById(username);
      slime.innerHTML = `<h1>${username}</h1>`;
    }
  }, 4000);
});