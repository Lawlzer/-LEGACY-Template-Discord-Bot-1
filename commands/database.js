const requirements = require('./requirements');
const databaseController = require('../lib/database');

exports.Help = {
  blurb: '<commandPrefix>help.',
  help: '!help !help !help !help wait... that isn\'t how this works?',
  example: '<commandPrefix>help || <commandPrefix>help ping',
  arguments: '',
  requirements: [],
  execute: databaseController.help,
}

exports.AdminHelp = {
  blurb: 'Get help for the admin-only commands.',
  help: 'Get help for the commands that are only available to admin users.',
  example: '<commandPrefix>adminHelp',
  arguments: '',
  requirements: [requirements.admin],
  execute: databaseController.adminHelp,
}

exports.Ping = {
  blurb: 'Make sure the server is running',
  help: 'Make sure the server is running',
  example: '<commandPrefix>ping',
  arguments: '',
  requirements: [],
  execute: databaseController.ping,
}

exports.Pong = {
  blurb: 'Make sure the server is running',
  help: 'Make sure the server is running',
  example: '<commandPrefix>pong',
  arguments: '',
  requirements: [requirements.admin],
  execute: databaseController.pong,
}

exports.AmIAdmin = {
  blurb: 'Check if you are an admin.',
  help: 'This will reply \'true\' if you have the admin role.',
  example: '<commandPrefix>amIAdmin',
  arguments: '',
  requirements: [],
  execute: databaseController.amIAdmin,
}

exports.SetAdminRole = {
  blurb: 'Set the admin role.',
  help: 'Set the active admin role - Must not be set yet. (If already set, ask Lawlzer to change it. Please @ the role in the message.)',
  example: '<commandPrefix>setAdminRole @botAdmin',
  arguments: '',
  requirements: [requirements.oneArgument],
  execute: databaseController.setAdminRole,
}

exports.SetChatLog = {
  blurb: 'Set the channel for where things should be logged.',
  help: 'Set the active channel for where things should be set - Must be pinged & should be **only** for the bot.',
  example: '<commandPrefix>setChatLog #botLogChannel',
  requirements: [requirements.oneArgument, requirements.admin],
  execute: databaseController.setChatLog,
}



exports.SetPrefix = {
  blurb: 'Set the command prefix',
  help: 'Change the character before every command - by default, !',
  example: '<commandPrefix>setPrefix $',
  requirements: [requirements.oneArgument, requirements.admin],
  execute: databaseController.setPrefix,
}
