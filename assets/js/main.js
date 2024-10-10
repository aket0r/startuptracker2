const config = {
    location: {
        Ethernet: {
            current: null,
            scan: null
        },
        view: {
            IPv4: ""
        }
    }
}

$.getJSON("https://api.ipify.org/?format=json", function(e) {
    config.location.view.IPv4 = e.ip;
});

const { networkInterfaces } = require('os');
const wifi = require('node-wifi');
const processlist = require('node-processlist');


const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}


wifi.init({
    iface: null // network interface, choose a random wifi interface if set to null
});


wifi.scan((error, networks) => {
    if (error) {
        console.log(error);
        bodyDOM.createLog({
            date: new Date().toLocaleString(),
            message: error
        });
    } else {
    //   console.log(networks);
    bodyDOM.createLog({
        date: new Date().toLocaleString(),
        message: `[45] networks: ${JSON.stringify(networks, null, '\t')}`
    });
      config.location.Ethernet.scan = networks;
    }
});


wifi.getCurrentConnections(async (error, currentConnections) => {
    if (error) {
        console.log(error);
        bodyDOM.createLog({
            date: new Date().toLocaleString(),
            message: JSON.stringify(error)
        });
    } else {
        // console.log(currentConnections);
        config.location.Ethernet.current = currentConnections;
        setTimeout(() => {
            loadIPLocationItems();
        }, 200);
    }
});

async function getPorcesses() {
    await processlist.getProcesses().then((data) => {
        // console.log(data);
        bodyDOM.createLog({
            date: new Date().toLocaleString(),
            message: `[79] getPorcesses(), data: ${JSON.stringify(data)}`
        });
        loadProcessItems(data);
    });
}
getPorcesses();


function loadProcessItems(data) {
    data.forEach((object) => {
        bodyDOM.createProcess(object, object.date);
    })
}


const geoip = require('geoip-country');

function loadIPLocationItems() {
    const geo = geoip.lookup(config.location.view.IPv4);
    const data = {
        date: new Date().toLocaleString(),
        ip: config.location.view.IPv4,
        mac: config.location.Ethernet.current[0].mac,
        ssid: config.location.Ethernet.current[0].ssid,
        channel: config.location.Ethernet.current[0].channel,
        local: results['Ethernet'][0],
        location: `${geo.name}, ${geo.capital}`,
        native: geo.native,
        frequency: config.location.Ethernet.current[0].frequency,
        security: config.location.Ethernet.current[0].security,
    }
    bodyDOM.createIP(data);
}


window.addEventListener("load", function() {
    bodyDOM.loadIPListOnWin();

    setTimeout(() => {
        const homeLengthItems = document.querySelector(".home-length");
        const ipLengthItems = document.querySelector(".ip-history-length");
        const proccessLengthItems = document.querySelector(".proccess-history-length strong");
        const logsLengthItems = document.querySelector(".logs-length");
        const loading = this.document.querySelector(".loading-screen");
        homeLengthItems.innerText = lengthConfig.homeLengthItems;
        ipLengthItems.innerText = lengthConfig.ipLengthItems;
        proccessLengthItems.innerText = lengthConfig.proccessLengthItems;
        logsLengthItems.innerText = lengthConfig.logsLengthItems;
        loading.classList.add("hidden");
    }, 500);
});
