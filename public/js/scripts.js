const socket = io();

const game = document.getElementById('game');

socket.on('join', (slime) => {
  game.innerHTML += `
      <div id="slime"><h1>${slime.username}</h1></div>
    `;

  window.scrollTo(0, document.body.scrollHeight);
});