const lengthConfig = {
    homeLengthItems: 0,
    ipLengthItems: 0,
    proccessLengthItems: 0,
    logsLengthItems: 0
}

const settings = {
    processLimit: 150
}

class BODY {
    constructor() {
        this.loadLogsOnWin();
    }
    createProcess(data, date = new Date().toLocaleString(), isNew = true) {
        const path = document.querySelector("#table #list.process-history");
        const element = document.createElement("div");
        element.id = "item";
        element.innerHTML =
        `
            <div>${date}</div>
            <div>${data.pid}</div>
            <div class="mem">${(data.memUsage / 1e+6).toFixed(2)} Mb</div>
            <div title="${data.name}">${data.name}</div>
            <div>${data.sessionName}</div>
            <div>${data.sessionNumber}</div>
        `
        path.prepend(element);
        if(isNew == true) {
            let oldData = this.loadProcessList();
            data.date = new Date().toLocaleString();
            oldData.push(data);
            let json = JSON.stringify(oldData, null, '\t');
            fs.writeFileSync("assets/data/process-list.json", json, (() => {}));
        }
    }

    loadIPList() {
        try {
            const read = fs.readFileSync("assets/data/ip-list.json");
            const parse = JSON.parse(read);
            lengthConfig.ipLengthItems = parse.length;
            return parse;
        } catch(e) {
            console.error(e);
            fs.writeFileSync("assets/data/ip-list.json", "[]");
            this.createLog({
                date: new Date().toLocaleString(),
                message: e
            });
            return [];
        }
    }

    loadProcessList() {
        try {
            const read = fs.readFileSync("assets/data/process-list.json");
            let parse = JSON.parse(read);
            lengthConfig.proccessLengthItems = parse.length;
            if(parse.length >= settings.processLimit) {
                for(let i = 0; i <= parse.length - settings.processLimit; i++) {
                    delete parse[i];
                }
            }
            parse = parse.filter(x => {
                return x != 'empty'
            })
            return parse;
        } catch(e) {
            console.error(e);
            fs.writeFileSync("assets/data/process-list.json", "[]");
            this.createLog({
                date: new Date().toLocaleString(),
                message: e
            });
            return [];
        }
    }

    loadProcessListOnWin() {
        const read = fs.readFileSync("assets/data/process-list.json");
        const parse = JSON.parse(read);
        parse.forEach(data => {
            this.createProcess(data, data.date, false);
        });
    }

    loadIPListOnWin() {
        try {
            const read = fs.readFileSync("assets/data/ip-list.json");
            const parse = JSON.parse(read);
            parse.forEach(data => {
                this.createIP(data, data.date, false);
            });
        } catch(e) {
            fs.writeFileSync("assets/data/ip-list.json", "[]");
        }
    }

    createIP(data, date = new Date().toLocaleString(), isNew = true) {
        const path = document.querySelector("#table #list.ip-history-location");
        const element = document.createElement("div");
        element.id = "item";
        element.innerHTML =
        `
            <div>${date}</div>
            <div class="main">${data.ip}</div>
            <div>${data.mac}</div>
            <div>${data.ssid}</div>
            <div>${data.channel}</div>
            <div class="main">${data.local}</div>
            <div>${data.location}</div>
            <div>${data.native}</div>
            <div>${data.frequency}</div>
            <div>${data.security}</div>
        `
        path.prepend(element);
        if(isNew == true) {
            let oldData = this.loadIPList();
            oldData.push(data);
            let json = JSON.stringify(oldData, null, '\t');
            fs.writeFileSync("assets/data/ip-list.json", json, (() => {}));
        }
    }

    loadLogs() {
        try {
            const read = fs.readFileSync("assets/data/logs.json");
            let parse = JSON.parse(read);
            lengthConfig.logsLengthItems = parse.length;
            return parse;
        } catch(e) {
            console.error(e);
            fs.writeFileSync("assets/data/logs.json", "[]");
            this.createLog({
                date: new Date().toLocaleString(),
                message: e
            });
            return [];
        }
    }

    loadLogsOnWin() {
        try {
            const read = fs.readFileSync("assets/data/logs.json");
            const parse = JSON.parse(read);
            parse.forEach(data => {
                this.createLog(data, data.date, false);
            });
        } catch(e) {
            fs.writeFileSync("assets/data/logs.json", "[]");
        }
    }

    createLog(data, date = new Date().toLocaleString(), isNew = true) {
        const path = document.querySelector("#table #list.log-location");
        const element = document.createElement("div");
        element.id = "item";
        element.innerHTML =
        `
            <div class="date-text">${date}</div> <div class="message">${data.message}</div>
        `
        path.prepend(element);
        if(isNew == true) {
            let oldData = this.loadLogs();
            oldData.push(data);
            let json = JSON.stringify(oldData, null, '\t');
            fs.writeFileSync("assets/data/logs.json", json, (() => {}));
        }
    }
}

const fs = require("fs");
const child_process = require('child_process');
class DATA {
    constructor() {
        this.load();
    }

    load() {
        const data = fs.readFileSync("assets/data/start.json");
        const json = JSON.parse(data);
        if(!json || !Array.isArray(json)) return;

        for(let i = 0; i < json.length; i++) {
            this.create(json[i], i+1);
        }
        lengthConfig.homeLengthItems = json.length
    }

    create(data, index) {
        const path = document.querySelector("#table #list");
        const element = document.createElement("div");
        element.id = "item";
        element.innerHTML =
        `
            <div>${index}</div>
            <div>${data.username}</div>
            <div>${data.startedAt}</div>
            <div>${data.pc}</div>
            <div class="ip-link ${(data.IP == "undefined") ? "inactive" : "active"}" data-correctIP="${(data.IP == "undefined") ? false : true}">${(data.IP == "undefined") ? "N/A" : data.IP}</div>
        `
        path.prepend(element);
    }
}


const data = new DATA();

const list = document.querySelector("#list");
list.addEventListener("click", function(event) {
    event.preventDefault();
    let t = event.target;
    if(t.className == "ip-link active") {
        child_process.exec(`start https://whatismyipaddress.com/ip/${t.innerText.trim()}`);
    }
});




const buttons = document.querySelectorAll("#navigation");
const sections = document.querySelectorAll("#nav-section");
const pagesElements = document.querySelectorAll('#list');
buttons.forEach(btn => {
    btn.addEventListener("click", function() {
        sections.forEach(section => section.classList.add("hidden"));
        const location = btn.dataset.nav;
        let avalabileSection = document.querySelector(`[data-location="${location}"]`);
        avalabileSection.classList.remove("hidden");
    });
});

const bodyDOM = new BODY();

const searchInHome = document.querySelector(".home-search-bar");
searchInHome.addEventListener("input", function() {
    const page = document.querySelectorAll('[data-location="home"] #list > div');
    if(!page) return;
    page.forEach(item => {
        let txt = item.innerText.toLowerCase();
        if(!(txt.indexOf(this.value) > -1)) {
            item.classList.add("hidden");
        }
        if(this.value == "") item.classList.remove("hidden");
    })
})

const searchInIPHistory = document.querySelector(".ip-history-search-bar");
searchInIPHistory.addEventListener("input", function() {
    const page = document.querySelectorAll('[data-location="ip-history"] #list > div');
    if(!page) return;
    page.forEach(item => {
        let txt = item.innerText.toLowerCase();
        if(!(txt.indexOf(this.value) > -1)) {
            item.classList.add("hidden");
        }
        if(this.value == "") item.classList.remove("hidden");
    })
})

const searchInProcess = document.querySelector(".proccess-history-search-bar");
searchInProcess.addEventListener("input", function() {
    const page = document.querySelectorAll('[data-location="proccess-history"] #list > div');
    if(!page) return;
    page.forEach(item => {
        let txt = item.innerText.toLowerCase();
        if(!(txt.indexOf(this.value) > -1)) {
            item.classList.add("hidden");
        }
        if(this.value == "") item.classList.remove("hidden");
    })
})
