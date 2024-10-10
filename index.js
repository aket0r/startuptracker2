const path = require("path");
const url = require("url");
const {app, BrowserWindow, Menu, Tray} = require("electron");
const fs = require("fs");
const os = require("os");
const username = os.hostname(); // PC Name
const nickname = os.userInfo().username; // Account name

class DATA {
    constructor() {
        this.load();
    }

    load() {
        const read = fs.readFileSync("assets/data/start.json");
        const parse = JSON.parse(read);
        return parse;
    }

    set(data) {
        if(!data || !Array.isArray(data)) return;
        data = this.load();
        data = data.filter(x => {
            return x != undefined && x != null;
        })
        let json = JSON.stringify(data, null, '\t');
        fs.writeFileSync("assets/data/start.json", json, (() => {}));
    }

    update(arr) {
        if(!arr) return;
        let data = this.load();
        data.push(arr);
        let json = JSON.stringify(data, null, '\t');
        fs.writeFileSync("assets/data/start.json", json, (() => {}));
    }
}

const data = new DATA();

let trayMenuTemplate = [
    {
        label: "Exit",
        click: function () {
            app.quit();
            app.quit();
        }
    }
];
let appTray = null;
let isTray = false;

async function getIP() {
    try {
        let url = "http://ip-jobs.staff-base.spb.ru/ip.cgi";
        const response = await fetch(url);
        const jsonData = await response.text();
        let data = jsonData.split("\n");
        const IP = data[0].replace('var IP="', "").replace('";', "");
        return IP;
    } catch {
        return "undefined";
    }
}

async function createWindow() {
    trayIcon = path.join(__dirname, 'assets/icons/');
    appTray = new Tray(path.join (trayIcon, 'icon.ico'));
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    appTray.setToolTip(`StartUp Tracker 2.0`);
    appTray.setContextMenu(contextMenu);
    

    appTray.on('click',function(){
        if(isTray) return;
        win = new BrowserWindow({
            resizable: true,
            width: 1920,
            height: 1080,
            autoHideMenuBar: true,
            icon: `${__dirname}/assets/icons/icon.ico`,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                __dirname: true
            },
            show: true
        });
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        }));
        win.removeMenu();

        win.maximize();
        app.focus();
        isTray = true;
        // win.webContents.openDevTools();

        win.on('closed', () => {
            win = null;
            isTray = false;
        });
    });
    const run = {
        pc: username,
        username: nickname,
        startedAt: new Date().toLocaleString(),
        IP: await getIP()
    }
    
    data.update(run);
    
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {});




