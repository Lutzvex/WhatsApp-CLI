const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const clearScreen = () => console.clear();

module.exports = { sleep, clearScreen };