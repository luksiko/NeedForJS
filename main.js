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
	speed: 3,
};

const startGame = () => {
	start.classList.add('hide');
	settings.start = true;
	gameArea.appendChild(car);
	requestAnimationFrame(playGame);
};

const playGame = () => {
	console.log('Play Game');
	if (settings.start) {
		requestAnimationFrame(playGame);
	}
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
