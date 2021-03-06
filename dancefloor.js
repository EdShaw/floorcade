const request = require('request-promise-native');
const util = require('util');
const net = require('net');
const os = require('os');

let screen;

module.exports.init = async (config, initialScreen) => {
    screen = initialScreen;
    console.log('Creating server...');
    const server = net.createServer();
    const listen = util.promisify(server.listen).bind(server);
    await listen();

    const host = getIpAddress();

    if (!host) {
        throw new Error('Could not determine local IP address');
    }

    const {port} = server.address();

    console.log(`Asking dancefloor at ${config.host}:${config.httpPort} to delegate to ${host}:${port}...`);
    await request.post(`http://${config.host}:${config.httpPort}/api/delegate`, {
        json:true,
        body: {
            host,
            port
        }
    });

    console.log('Awaiting connections...');
    server.on('connection', socket => {
        console.log('Got connection. Waiting for data...');
        socket.on('data', (data) => {    
            const [width, height] = data;
            screen.render(width, height, socket);
        });
    });
}

const getIpAddress = () => {
    const ifaces = os.networkInterfaces();
    for (let name of Object.keys(ifaces)) {
        for (iface of ifaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
}

module.exports.setScreen = (value) => screen = value;
