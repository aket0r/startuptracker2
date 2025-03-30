## 📁 [StartUp Tracker 2](https://github.com/aket0r/startuptracker2)

<div align="center">

**StartUp Tracker 2** — приложение, отслеживающее, кто и когда запускал ваш ПК.

</div>

### 🚀 Основные возможности

- Журнал запусков системы
- Сбор данных о пользователе
- Telegram-уведомления (опционально)

### 🧱 Технологии

- Electron
- Node.js (`fs`, `node-wifi`, `geoip-country`, `processlist`, `child_process`, `url`)

### ⚙️ Установка

```bash
npm install
npm i fs
npm i path
npm i url
npm i child_process
npm i os
npm i node-wifi
npm i node-processlist
npm i geoip-country

npm i electron
npm i electron-packager
npm i electron --save

npm run package
```

> [!WARNING]
> Скопируйте папку "assets" в **release-builds/startup-win32-ia32/**


Скрипты: `require.cmd`, `start.cmd`, `build.cmd`.
