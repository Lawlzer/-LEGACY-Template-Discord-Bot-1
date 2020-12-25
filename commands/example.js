const requirements = require('./requirements');
const exampleController = require('../lib/example');

exports.AddCommand = exports.SetCommand = {
    blurb: 'Add a new command!',
    help: 'Add/set a new command that anybody can use.',
    example: '<commandPrefix>setCommand leader Lawlzer is the leader',
    requirements: [requirements.twoArguments, requirements.admin],
    execute: exampleController.setCommand,
  }
  
  exports.RemoveCommand = exports.DeleteCommand = {
    blurb: 'Remove a command!',
    help: 'Remove a public command.',
    example: '<commandPrefix>removeCommand leader',
    requirements: [requirements.oneArgument, requirements.admin],
    execute: exampleController.removeCommand,
  }

  exports.GetUserCommmands = exports.UserCommands = {
    blurb: 'Get a list of all user-created commands',
    help: 'Returns a list of all user-created commands.',
    example: '<commandPrefix>getUserCommands',
    requirements: [],
    execute: exampleController.getUserCommands,
  }