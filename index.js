#!/usr/bin/env node
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const notifier = require('node-notifier');
const chalk = require('chalk');

// Import Modules
const { clearScreen } = require('./src/utils/helper');
const { showBootSequence } = require('./src/ui/banner');
const { showMainMenu } = require('./src/features/chat');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        args: ['--no-sandbox'],
        headless: true
    }
});

client.on('qr', (qr) => {
    clearScreen();
    console.log(chalk.yellow('Waiting for authentication...'));
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    await showBootSequence();
    showMainMenu(client);
});

client.on('message', async msg => {
    const contact = await msg.getContact();
    const name = contact.pushname || contact.number;
    notifier.notify({
        title: `New Message: ${name}`,
        message: msg.body,
        sound: true
    });
});

client.initialize();