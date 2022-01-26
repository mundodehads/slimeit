const socket = io();

const SLIMES_CACHE = {};

function addHowToPlaySlime() {
  const slime = document.getElementById('howtoplay');

  if (!slime) {
    const game = document.getElementById('lounge');

    game.innerHTML += `
      <div class="slime" id="howtoplay">
        <div class="slime-balloon"><p style="color:black;background-color:white;border-radius:20px;">To get a slime, type "!join" in chat!</p></div>
        <img src="/images/slime_base.gif" alt="Slime teaching how to play">
        <div class="slime-name"><p></p></div>
      </div>
    `;
  }
}

function addUserSlime(slime) {
  const game = document.getElementById(slime.biome);

  game.innerHTML += `
    <div class="slime" id="${slime.username}">
      <div class="slime-balloon" id="${slime.username}-balloon"><p></p></div>
      <img src="/images/slime_${slime.slimeData.race}.gif" alt="Slime">
      <div class="slime-name"><p>${slime.username}</p></div>
    </div>
  `;
}

socket.on('join', (slime) => {
  addUserSlime(slime);

  SLIMES_CACHE[slime.username] = slime;
  SLIMES_CACHE[slime.username].balloon = '';
});

socket.on('exit', (slime) => {
  const userSlime = document.getElementById(slime.username);
  userSlime.remove();

  delete SLIMES_CACHE[slime.username];
});

socket.on('travel', (slime) => {
  SLIMES_CACHE[slime.username].biome = slime.biome;

  const userSlime = document.getElementById(slime.username);
  userSlime.remove();

  addUserSlime(SLIMES_CACHE[slime.username]); 
});

socket.on('evolve', (slime) => {
  SLIMES_CACHE[slime.username].slimeData.race = slime.race;

  const userSlime = document.getElementById(slime.username);
  userSlime.remove();

  addUserSlime(SLIMES_CACHE[slime.username]); 
});

socket.on('chatBalloon', (balloon) => {
  const slime = document.getElementById(`${balloon.username}-balloon`);
  slime.innerHTML = `<p style="color:black;background-color:white;border-radius:20px;">${balloon.message}</p>`;
  SLIMES_CACHE[balloon.username].balloon = balloon.message;

  setTimeout((username = balloon.username, message = balloon.message) => {
    if (SLIMES_CACHE[balloon.username].balloon === message) {
      const slime = document.getElementById(`${username}-balloon`);
      slime.innerHTML = '<p></p>';
    }
  }, 4000);
});

addHowToPlaySlime();