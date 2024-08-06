// IndexWhatsApp.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const wwebVersion = '2.2412.54';

let clientInstance;

function initializeClient() {
    if (!clientInstance) {
        clientInstance = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
            webVersionCache: {
                type: 'remote',
                remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
            },
        });

        clientInstance.on('qr', qr => {
            qrcode.generate(qr, { small: true });
        });

        clientInstance.on('ready', () => {
            console.log('Client is ready!');
        });

        clientInstance.initialize();
    }

    return clientInstance;
}

async function sendWhatsappMessageToGroup(message, groupId = '120363208396149623@g.us') {
    const client = initializeClient();

    return new Promise((resolve, reject) => {
        client.on('ready', () => {
            client.sendMessage(groupId, message).then(response => {
                resolve(response);
            }).catch(err => {
                console.error('Failed to send message:', err);
                reject(err);
            });
        });
    });
}

module.exports = { sendWhatsappMessageToGroup };
