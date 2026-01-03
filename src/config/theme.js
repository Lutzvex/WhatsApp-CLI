const chalk = require('chalk');
const gradient = require('gradient-string');

const theme = {
    logo: gradient('cyan', 'blue', 'magenta'),
    text: chalk.cyanBright,
    border: 'magenta',
    wa: chalk.hex('#25D366'), 
    warning: chalk.hex('#F7E01D'), 
    dim: chalk.dim
};

module.exports = theme;