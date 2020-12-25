// This file has all of the code that the commands themselves run. This is where you can put your commands
// The function name should be whatever you set it to in commands/database.js
// A copy of this file (with the name changed) is example.js, and that's where I'd personally recommend you to put your commands.

const Discord = require('discord.js');
const Database = require('../models/Database');
const requirements = require('../commands/requirements');

const databaseCommands = require('../commands/allCommands');

// exports = Object.assign(exports, databaseCommands);

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

exports.replaceAll = async function (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


exports.returnEmbed = async function (bot, message, title, description) {
  const startTime = message.createdTimestamp;
  const endTime = new Date().getTime();
  const totalTime = endTime - startTime;
  
  const embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor('00EB66')
    .setFooter('Author: Lawlzer#4013 on Discord. Response time: ' + totalTime + 'ms.', 'https://i.imgur.com/ddwm0Su.jpg') //this is my picture
    .setURL('https://discord.js.org/')
    .setThumbnail('https://cdn.discordapp.com/attachments/635217459875676161/638450991322365969/SlapD.png'); //change this to the picture of the bot
  return embed;
}


exports.returnErrorEmbed = async function (bot, message, title, description) {
  const startTime = message.createdTimestamp;
  const endTime = new Date().getTime();
  const totalTime = endTime - startTime;

  const embed = new Discord.RichEmbed()
    .setTitle('ERROR')
    .setDescription(description)
    .setColor('#9E1A1A')
    .setFooter('If you need help, please ask user \'Lawlzer#4013\' on Discord. Response time: ' + totalTime + 'ms.', 'https://i.imgur.com/ddwm0Su.jpg') //change this to the picture of the bot
    .setThumbnail('https://cdn.discordapp.com/attachments/635217459875676161/638450991322365969/SlapD.png'); //change this to the picture of the bot
  return embed;
}



exports.sendChatMessage = async function (bot, message, messageToSend) {
  const database = await getOrCreateDatabase(message.guild.id);
  var chatLogId = database.chatLogId;
  if (!chatLogId) {
    message.channel.send(await exports.returnEmbed(bot, message, 'Extra-Fancy', 'If you want to make the bot even cooler (for admins), use !help setChatLog'));
    return;
  }
  if (!messageToSend) {
    return;
  }
  bot.channels.get(chatLogId).send(messageToSend);
}

exports.help = async function (bot, message, argsLowercase, content) {
  const database = await getOrCreateDatabase(message.guild.id);
  var isAdmin;
  if (!database.adminRoleId) {
    console.log('No admin role set. Will assume the user is an admin.');
    message.channel.send(await exports.returnEmbed(bot, message, 'No Admin Role Set', 'Will assume you are an admin. Please do !help SetAdminRole'));
    isAdmin = true;
  }

  if (!isAdmin && message.member.roles.some(role => role.id == database.adminRoleId)) {
    isAdmin = true;
  }

  // Specific command help
  if (argsLowercase.length != 0) {
    message.channel.send(await exports.returnEmbed(bot, message, argsLowercase[0], await returnSpecificHelpResponse(bot, message, argsLowercase)));
    return;
  }

  // AdminHelp
  if (argsLowercase.length == 0 && isAdmin) {
    message.channel.send(await exports.returnEmbed(bot, message, 'Admin Help', await returnAdminHelpResponse(bot, message)));
    return;
  }

  // Basic Help 
  if (argsLowercase.length == 0 && !isAdmin) {
    message.channel.send(await exports.returnEmbed(bot, message, 'Help <Me>', await returnNotAdminHelpResponse(bot, message)));
    return;
  }
}

exports.ping = async function (bot, message, argsLowercase, content) {
  await message.channel.send(await exports.returnEmbed(bot, message, 'Ping', 'pong!'));
}

exports.pong = async function (bot, message, argsLowercase, content) {
  message.channel.send(await exports.returnEmbed(bot, message, 'Pong', 'ping!'));
}

// If you want the same database for every Discord server, you can change serverId to something pre-set.
// e.g `serverId: 'allServers'`
// then whenever it searches for the database, it'll always find the same one, based on that ID.
let getOrCreateDatabase = async function (discordId) {
  let database = await Database.findOne().where('serverId').equals(discordId);
  if (!database) {
    database = new Database({
      serverId: discordId,
      adminRole: '',
      commandPrefix: '!', // if you want a different commandPrefix by default, feel free to change this.
      // commandPrefixes support literally anything I could test. xss attacks, spaces in names, multiple words, everything
      // but I wouldn't recommend having a ` in your commandPrefix, based on my laziness in the help command, and Discord formatting
      // but it looks kind of cool, so if you want, set the commandPrefix to `whatever 
      // then run `whatever help
      // and you'll see something great
    });
    await database.save();
    console.log('new Discord server object created.');
  }
  return database;
};
exports.getOrCreateDatabase = getOrCreateDatabase;

exports.setAdminRole = async function (bot, message, argsLowercase, content) {
  var database = await getOrCreateDatabase(message.guild.id);
  if (!!database.adminRoleId) {
    message.channel.send(await exports.returnErrorEmbed(bot, message, 'ERROR', 'There is already an admin role set. Message `Lawlzer#4013` if you need this fixed.'));
    return;
  }
  if (argsLowercase[0].replace('<@&', '') !== argsLowercase[0]) {
    var adminRoleToAdd = argsLowercase[0].replace('<@&', '').replace('>', '');
    database.adminRoleId = adminRoleToAdd;
    await database.save();
    message.channel.send(await exports.returnEmbed(bot, message, 'Admin Role Set', 'The admin role has been set to ' + argsLowercase[0]));
    exports.sendChatMessage(bot, message, 'The admin role has been set to ' + argsLowercase);
    return;
  }
  message.channel.send(await exports.returnErrorEmbed(bot, message, 'ERROR', 'Please ensure that you are pinging (@\'ing a role) to set the admin role to.'));
}

exports.amIAdmin = async function (bot, message, argsLowercase, content) {
  const database = await exports.getOrCreateDatabase(message.guild.id);
  if (!database.adminRoleId) {
    message.channel.send(await exports.returnErrorEmbed(bot, message, 'ERROR', 'The admin role ID has not yet been set. Please use `!setAdminRole` to fix this.'));
    return;
  }

  if (message.member.roles.some(role => role.id == database.adminRoleId)) {
    const embed = await exports.returnEmbed(bot, message, 'Admin', 'You are an admin!');
    message.channel.send(embed);
    return;
  }
  const embed = await exports.returnErrorEmbed(bot, message, 'Not Admin', 'You are not an admin.');
  message.channel.send(embed);
}

exports.setChatLog = async function (bot, message, argsLowercase, content) {
  var database = await getOrCreateDatabase(message.guild.id);
  if (!!database.chatLogId) {
    message.channel.send(await exports.returnErrorEmbed(bot, message, 'Set Chat Log', 'There is already a chat log channel specified. Message `Lawlzer#4013` if you need this fixed.'));
    return;
  }
  if (argsLowercase[0].replace('<#', '') !== argsLowercase[0]) {
    var chatLogToAdd = argsLowercase[0].replace('<#', '').replace('>', '');
    database.chatLogId = chatLogToAdd;
    await database.save();
    message.channel.send(await exports.returnEmbed(bot, message, 'SetChatLog', 'The chat log ID has been set to ' + argsLowercase[0]));
    return;
  }
  message.channel.send(await exports.returnErrorEmbed(bot, message, 'Set Chat Log', 'Failed to set the chat log. Please make sure you are pinging (`#`) a specific chat. Use :!help setChatLog for more help."'));
}

exports.setPrefix = async function (bot, message, argsLowercase, content) {
  var database = await getOrCreateDatabase(message.guild.id);
  if (!database.chatLogId) {
    message.channel.send(await exports.returnErrorEmbed(bot, message, 'Set Prefix', 'There is no chat log created. Use !help setChatLog to fix this. Command will continue'));
  }
  var entireMessage = message.content;
  entireMessage = entireMessage.toLowerCase(); // we want it to be in lowercase
  newPrefix = entireMessage.replace('setprefix', ''); // replace the command itself with nothing
  newPrefix = newPrefix.replace(database.commandPrefix, ''); // also replace the old prefix 

  while (newPrefix.startsWith(' ')) {
    newPrefix = newPrefix.substring(1, newPrefix.length);
  }
  // if we have any spaces at the start, just delete them

  //newPrefix = newPrefix.split(' ').join(''); // remove any spaces, screw those things in prefixes

  database.commandPrefix = newPrefix;
  await database.save();
  message.channel.send(await exports.returnEmbed(bot, message, 'Set Prefix', 'The prefix has been set to: ' + newPrefix));
}





async function returnSpecificHelpResponse(bot, message, argsLowercase) {
  const database = getOrCreateDatabase(message.guild.id);
  // this code looks for SPECIFIC commands - e.g !help ping
  var keys = Object.keys(databaseCommands); //keys are the NAMES of all the objects (in array form)... e.g "help", "adminhelp", "ping", etc.
  for (let i = 0; i < keys.length; i++) {
    if (argsLowercase[0] == keys[i]) {
      var description = 'Description: ' + databaseCommands[keys[i]].blurb + '\n Example: ' + databaseCommands[keys[i]].example;

      description += databaseCommands[keys[i]].arguments == '' || databaseCommands[keys[i]].arguments == undefined //newline here to make it look way better
        ? '' : '\nArguments: ' + databaseCommands[keys[i]].arguments;

      var response = exports.replaceAll(description, '<commandPrefix>', database.commandPrefix);
      return response;
    }
  }

  message.channel.send(await exports.returnErrorEmbed(bot, message, '3RR0R', 'No command "!' + argsLowercase[0] + '" found.'));
}

async function returnAdminHelpResponse(bot, message) {
  const database = await getOrCreateDatabase(message.guild.id);
  var response = '';
  const keys = Object.keys(databaseCommands);
  var lastBlurb = null;
  for (let i = 0; i < keys.length; i++) {
    if (lastBlurb != databaseCommands[keys[i]].blurb) {
      lastBlurb = databaseCommands[keys[i]].blurb;
      response += '\n' + database.commandPrefix + keys[i] + ': ' + databaseCommands[keys[i]].blurb;
    }
  }
  return response = exports.replaceAll(response, '<commandPrefix>', database.commandPrefix);
}

async function returnNotAdminHelpResponse(bot, message) {
  const database = await getOrCreateDatabase(message.guild.id);
  var response = '';
  var keys = Object.keys(databaseCommands); //keys are the NAMES of all the objects (in array form)... e.g "help", "adminhelp", "ping", etc.
  var requireAdmin = false;
  for (let i = 0; i < keys.length; i++) { //for every NAMED object in commands/database.js

    for (let j = 0; j < databaseCommands[keys[i]].requirements.length; j++) { //For every requirement in the current object
      if (requirements.admin == databaseCommands[keys[i]].requirements[j]) { //if the requirement is 'requirements.admin' set it to requiring admin.
        requireAdmin = true;
      }
    }
    if (!requireAdmin) { //if this command never requires admin, add it
      response += '\n' + database.commandPrefix + keys[i] + ': ' + databaseCommands[keys[i]].blurb;
    }
    requireAdmin = false; //then reset it and check the next command!
  }
  response = exports.replaceAll(response, '<commandPrefix>', database.commandPrefix);
  return response;
}

exports.returnPrefix = async function (guildId) {
  const database = await getOrCreateDatabase(guildId);
  return database.commandPrefix;
}