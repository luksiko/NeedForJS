// Настройки для запуска приложения в десктопной версии
const url = require('url').format({
	protocol: 'file',
	slashes: true,
	pathname: require('path').join(__dirname, 'index.html'),
});

const {app, BrowserWindow} = require('electron');

let win;

const createWindow = () => {
	win = new BrowserWindow({
		width: 500,
		height: 850,
	});

	win.loadURL(url);

	win.on('closed', () => {
		win = null;
	});
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	app.quit();
});
