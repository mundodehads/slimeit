const socket = io();

const BALLOONS = {};

function clearSlimeBalloon(username, message) {

}

socket.on('join', (slime) => {
  const game = document.getElementById('game');

  game.innerHTML += `
    <div class="slime" id="${slime.username}">
      <div class="slime-balloon" id="${slime.username}-balloon"><p></p></div>
      <img src="/images/slime_${slime.slimeData.race}.gif" alt="Slime">
      <div class="slime-name"><p>${slime.username}</p></div>
    </div>
  `;

  BALLOONS[slime.username] = '';
});

socket.on('exit', (slime) => {
  const userSlime = document.getElementById(slime.username);
  userSlime.remove();

  delete BALLOONS[slime.username];
});

socket.on('chatBalloon', (balloon) => {
  const slime = document.getElementById(`${balloon.username}-balloon`);
  slime.innerHTML = `<p style="color:black;background-color:white;border-radius:20px;">${balloon.message}</p>`;
  BALLOONS[balloon.username] = balloon.message;

  setTimeout((username = balloon.username, message = balloon.message) => {
    if (BALLOONS[username] === message) {
      const slime = document.getElementById(`${username}-balloon`);
      slime.innerHTML = '<p></p>';
    }
  }, 4000);
});