const databaseCommands = require('./database');
const requirements = require('./requirements')

const exampleCommands = require('./example');

exports = Object.assign(exports, databaseCommands, exampleCommands);

// legacy comment
//honestly I don't understand this, it just works