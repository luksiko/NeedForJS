const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.game_area');
const car = document.createElement('div');

car.classList.add('car');

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const settings = {
	start: false,
	score: 0,
	speed: 4,
	traffic: 3,
};

getQuantityElements = (heightElement) => {
	return document.documentElement.clientHeight / heightElement + 1;
};

const startGame = () => {
	start.classList.add('hide');
	gameArea.innerHTML = '';

	for (let i = 0; i < getQuantityElements(100); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * 100) + 'px';
		line.y = i * 100;
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.classList.add('car');
		enemy.y = -100 * settings.traffic * (i + 1);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = 'transparent url(./images/enemy2.png) center / cover no-repeat';
		gameArea.appendChild(enemy);
	}

	settings.score = 0;
	settings.start = true;
	gameArea.appendChild(car); // разместили авто на дороге
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
		settings.score += settings.speed;
		score.innerHTML = 'ОЧКИ<br>' + settings.score;
		if (keys.ArrowLeft && settings.x > 0) settings.x -= settings.speed;
		if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) settings.x += settings.speed;
		if (keys.ArrowUp && settings.y > 0) settings.y -= settings.speed;
		if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) settings.y += settings.speed;
		car.style.left = settings.x + 'px';
		car.style.top = settings.y + 'px';
		requestAnimationFrame(playGame);
	}
};

const moveRoad = () => {
	let lines = document.querySelectorAll('.line');
	lines.forEach(line => {
		line.y += settings.speed;
		line.style.top = line.y + 'px';
		if (line.y > document.documentElement.clientHeight) {
			line.y = -100;
		}
	});
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
			console.warn('ДТП');
			start.classList.remove('hide');
			start.style.top = score.offsetHeight;
		}
		item.y += settings.speed / 2;
		item.style.top = item.y + 'px';
		if (item.y >= document.documentElement.clientHeight) {
			item.y = -100 * settings.traffic;
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
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

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
