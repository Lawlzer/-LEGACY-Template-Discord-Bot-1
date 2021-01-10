// This is an example file, that has everything already working and necessary for yout o create your own, custom files/database names
// and things like that. If you want to create multiple command files with different names, you can ctrl + F "example" from every
// file, and basically copy and paste whatever you see there, and add your new names and whatever you need to.

const requirements = require('./requirements');
const exampleController = require('../lib/example');

exports.AddCommand = exports.SetCommand = exports.AddUserCommand = exports.SetUserCommand = exports.CreateUserCommand = exports.CreateCommand = {
  blurb: 'Add a new command!',
  help: 'Add/set a new command that anybody can use.',
  example: '<commandPrefix>setCommand leader Lawlzer is the leader',
  requirements: [requirements.twoArguments, requirements.admin],
  execute: exampleController.setCommand,
}

exports.RemoveCommand = exports.DeleteCommand = exports.DeleteUserCommand = exports.RemoveUserCommand = {
  blurb: 'Remove a command!',
  help: 'Remove a public command.',
  example: '<commandPrefix>removeCommand leader',
  requirements: [requirements.oneArgument, requirements.admin],
  execute: exampleController.removeCommand,
}

exports.GetUserCommmands = exports.UserCommands = exports.GetCommands = {
  blurb: 'Get a list of all user-created commands',
  help: 'Returns a list of all user-created commands.',
  example: '<commandPrefix>getUserCommands',
  requirements: [],
  execute: exampleController.getUserCommands,
}

exports.CreatePoll = exports.CreateAPoll = exports.Poll = {
  blurb: 'Create a poll!',
  help: 'Use this command to create a poll, then react to it to create new poll options. OR, put emojis at the end of the text, and it\'ll automatically add them as poll options.',
  example: '<commandPrefix>CreatePoll Is Lawlzer the best admin?',
  requirements: [requirements.admin, requirements.oneArgument],
  execute: exampleController.createPoll,
}

exports.removePoll = exports.deletePoll = {
  blurb: 'Delete a poll!',
  help: 'Use this command to delete a poll. This will automatically remove the poll, then add it to the channel set in <commandPrefix>setChatLog',
  example: '<commandPrefix>deletePoll waitthisneedswork-!TODO',
  requirements: [requirements.admin, requirements.oneArgument],
  execute: exampleController.removePoll,
}