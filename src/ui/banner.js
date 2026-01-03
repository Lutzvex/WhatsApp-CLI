const figlet = require('figlet');
const chalk = require('chalk');
const gradient = require('gradient-string');
const theme = require('../config/theme');
const { sleep, clearScreen } = require('../utils/helper');

const showBanner = () => {
    const bigTitle = figlet.textSync('WhatsApp - CLI', { 
        font: 'ANSI Shadow', 
        horizontalLayout: 'full' 
    });
    
    console.log(theme.logo(bigTitle));
    console.log(theme.dim('━'.repeat(65)));
    console.log(gradient.pastel('  >> SECURE TERMINAL CONNECTION ESTABLISHED <<'));
    console.log(theme.dim('━'.repeat(65)));
};

async function showBootSequence() {
    clearScreen();
    const steps = [
        'Initializing core modules...',
        'Bypassing local firewalls...',
        'Decrypting session keys...',
        'Connecting to WhatsApp servers...',
        'Handshake successful.',
        'Loading interface...'
    ];

    for (const step of steps) {
        process.stdout.write(theme.text(`[SYSTEM] ${step}`));
        await sleep(300); 
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log(chalk.green(`[OK] ${step}`));
    }
    await sleep(500);
}

module.exports = { showBanner, showBootSequence };