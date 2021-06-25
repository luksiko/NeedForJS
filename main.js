'use strict';

const score = document.querySelector('.score');
const speed = document.querySelector('.speed');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.game_area');
const car = document.createElement('div');
const buttons = document.querySelectorAll('.button');

car.classList.add('car');
let audioTrack = new Audio('');
const MAX_ENEMY = 8;
const HEIGHT_ELEM = 100;

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const settings = {
	start: false,
	score: 0,
	speed: 2,
	traffic: 2.5,
};

let getQuantityElements = (heightElement) => (gameArea.offsetHeight / heightElement) + 1;

const getRandomEnemy = max => Math.floor(Math.random() * max + 1);

const playAudio = (path) => {
	audioTrack.pause();
	console.dir(audioTrack);
	audioTrack = new Audio(path);
	audioTrack.addEventListener("canplaythrough", () => audioTrack.play());
};

const changeLevel = (lvl) => {
	switch (lvl) {
		case '1':
			settings.traffic = 4;
			settings.speed = 3;
			break;
		case '2':
			settings.traffic = 3;
			settings.speed = 6;
			break;
		case '3':
			settings.traffic = 3;
			settings.speed = 8;
			break;
	}
};

const startGame = (event) => {
	const target = event.target;
	if (!target.classList.contains('button')) return;

	const levelGame = target.dataset.level;

	changeLevel(levelGame);

	buttons.forEach(btn => btn.disabled = true);

	gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM + 'px';

	start.classList.add('hide');
	gameArea.innerHTML = '';
	playAudio('./audio/2.mp3');
	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * HEIGHT_ELEM) + 'px';
		line.style.height = (HEIGHT_ELEM / 2) + 'px';
		line.y = i * HEIGHT_ELEM;
		gameArea.append(line);
	}

	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * settings.traffic); i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.classList.add('car');
		enemy.y = -HEIGHT_ELEM * settings.traffic * (i + 1);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - (HEIGHT_ELEM / 2))) + 'px';
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = `transparent url(./images/enemy${getRandomEnemy(MAX_ENEMY)}.png) center / contain no-repeat`;
		gameArea.append(enemy);
	}

	settings.score = 0;
	settings.start = true;
	gameArea.append(car); // разместили авто на дороге
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
	car.style.top = 'auto';
	car.style.bottom = '10px';
	settings.x = car.offsetLeft;
	settings.y = car.offsetTop;
	requestAnimationFrame(playGame);
};


const playGame = () => {
	moveRoad();
	moveEnemy();
	if (settings.start) {
		settings.score += Math.floor(settings.speed);
		score.innerHTML = 'ОЧКИ<br>' + settings.score;
		speed.innerHTML = 'Скорость<br>' + Math.floor(settings.speed);

		settings.score /5000

		if (keys.ArrowLeft && settings.x > 0) settings.x -= settings.speed;
		if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) settings.x += settings.speed;
		if (keys.ArrowUp && settings.y > 0) settings.y -= settings.speed;
		if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) settings.y += settings.speed;
		car.style.left = settings.x + 'px';
		car.style.top = settings.y + 'px';
		requestAnimationFrame(playGame);
	} else {
		// при столкновении останавливаем трек
		audioTrack.pause();
		buttons.forEach(btn => btn.disabled = false);

	}
};

setInterval(() => {
	settings.speed += 0.1;
}, 1000);


const moveRoad = () => {
	let lines = document.querySelectorAll('.line');
	lines.forEach(line => {
		line.y += settings.speed;
		line.style.top = line.y + 'px';
		if (line.y >= gameArea.offsetHeight) {
			line.y = -HEIGHT_ELEM;
		}
	});
};

const setScoreToStorage = () => {
	if (settings.score > localStorage.getItem('score')) {
		score.innerHTML = 'Вы набрали ' + settings.score + ' очков! <br>Это рекорд!';
		speed.innerHTML = '';
		localStorage.setItem('score', settings.score);
	}
};

const moveEnemy = () => {
	let enemy = document.querySelectorAll('.enemy');
	enemy.forEach(item => {
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if (carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {

			settings.start = false;
			start.classList.remove('hide');
			setScoreToStorage();

		}
		item.y += settings.speed / 2;
		item.style.top = item.y + 'px';
		item.style.top = item.y + 'px';
		if (item.y >= gameArea.offsetHeight) {
			item.y = -HEIGHT_ELEM * settings.traffic;
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - (HEIGHT_ELEM / 2))) + 'px';
		}
	});

};

const startRun = (event) => {
	event.preventDefault();
	keys[event.key] = true;
};

const stopRun = (event) => {
	event.preventDefault();
	keys[event.key] = false;
};


playAudio('./audio/1.mp3');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
