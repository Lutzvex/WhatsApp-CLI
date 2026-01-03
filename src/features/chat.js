const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const gradient = require('gradient-string');
const theme = require('../config/theme');
const { clearScreen, sleep } = require('../utils/helper');
const { showBanner } = require('../ui/banner');

// --- MAIN MENU ---
async function showMainMenu(client) {
    clearScreen();
    showBanner();
    
    if (client.info) {
        let battery = 'N/A';
        try {
            const b = await client.getInterface().getBatteryStatus();
            battery = `${b.battery}%`;
        } catch(e) {}

        const infoText = `${chalk.bold(client.info.pushname)} | ${client.info.wid.user} | Battery: ${battery}`;
        
        console.log(boxen(infoText, {
            padding: 0, borderStyle: 'classic', borderColor: 'gray', dimBorder: true
        }));
    }

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: theme.text('SELECT OPERATION >'),
            choices: [
                { name: '📨  Open Chat List', value: 'chat_list' },
                { name: '📡  Broadcast / Manual', value: 'manual' },
                { name: '❓  Help / Manual', value: 'help' }, 
                { name: '❌  Terminate Session', value: 'exit' }
            ]
        }
    ]);

    await handleMenu(answers.action, client);
}

async function handleMenu(action, client) {
    switch(action) {
        case 'chat_list': await showContactPicker(client); break;
        case 'manual': await manualInput(client); break;
        case 'help': await showHelpScreen(client); break; 
        case 'exit': 
            console.log(chalk.red('Terminating...')); 
            process.exit(0); 
            break;
    }
}

// --- SUB FEATURES ---

async function showContactPicker(client) {
    const chats = await client.getChats();
    const recentChats = chats.slice(0, 12).map(chat => ({
        name: `${chat.name} ${chat.unreadCount > 0 ? chalk.red(`(${chat.unreadCount})`) : ''}`,
        value: chat.id._serialized
    }));

    recentChats.push(new inquirer.Separator());
    recentChats.push({ name: '🔙 Back', value: 'back' });

    const { id } = await inquirer.prompt([{
        type: 'list',
        name: 'id',
        message: 'Select Target:',
        choices: recentChats,
        pageSize: 15
    }]);

    if (id === 'back') return showMainMenu(client);
    await enterChatRoom(client, id);
}

async function enterChatRoom(client, chatId) {
    clearScreen();
    const chat = await client.getChatById(chatId);
    
    console.log(gradient.cristal(figlet.textSync(chat.name.substring(0, 10), { font: 'Standard' })));
    console.log(theme.dim('------------------------------------------------'));

    const messages = await chat.fetchMessages({ limit: 8 });
    messages.forEach(msg => {
        const time = new Date(msg.timestamp * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
        if (msg.fromMe) {
            console.log(chalk.cyan(`[${time}] Me:`));
            console.log(chalk.white(msg.body));
        } else {
            console.log(theme.wa(`[${time}] ${chat.name}:`));
            console.log(chalk.white(msg.body));
        }
        console.log('');
    });

    const { reply } = await inquirer.prompt([{
        type: 'input',
        name: 'reply',
        message: theme.logo('Type message (type "menu" to exit) >')
    }]);

    if (reply.toLowerCase() === 'menu') return showMainMenu(client);
    
    if (reply.trim()) {
        await chat.sendMessage(reply);
    }
    await enterChatRoom(client, chatId); 
}

async function manualInput(client) {
    const q = await inquirer.prompt([
        { type: 'input', name: 'num', message: 'Target Number (628...):' },
        { type: 'input', name: 'msg', message: 'Message Payload:' }
    ]);
    const finalNum = q.num.includes('@c.us') ? q.num : `${q.num}@c.us`;
    await client.sendMessage(finalNum, q.msg);
    console.log(chalk.green('>> Payload Delivered'));
    await sleep(1500);
    showMainMenu(client);
}

async function showHelpScreen(client) {
    clearScreen();
    const helpContent = `
${chalk.bold.underline('NAVIGATION GUIDE')}
• Use ${chalk.yellow('UP/DOWN')} arrow keys to navigate menus.
• Press ${chalk.yellow('ENTER')} to select an option.

${chalk.bold.underline('CHAT ROOM COMMANDS')}
• Type your message and press ENTER to send.
• Type ${theme.warning('"menu"')} (without quotes) to exit the chat room.

${chalk.bold.underline('ICONS LEGEND')}
📨 : Unread Messages / Chat List
📡 : Manual Send (By typing number)
❌ : Exit Application
    `.trim();

    console.log(boxen(helpContent, {
        title: 'SYSTEM MANUAL',
        titleAlignment: 'center',
        borderStyle: 'double',
        borderColor: 'cyan',
        padding: 1,
        margin: 1
    }));

    await inquirer.prompt([{ type: 'input', name: 'back', message: 'Press ENTER to return to Main Menu...' }]);
    showMainMenu(client);
}

module.exports = { showMainMenu };