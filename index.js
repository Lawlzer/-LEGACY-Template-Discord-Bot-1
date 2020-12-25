//Invite Link for the bot: https://discordapp.com/oauth2/authorize?client_id=584171613671522304&scope=bot

console.log('The bot is in index.js');

const production = false; 

const commands = require('./commands/allCommands');
const databaseController = require('./lib/database');
const mongoose = require('mongoose');
const Discord = require('discord.js');

const dotenv = require('dotenv');
dotenv.load({ path: '.env' });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

const bot = new Discord.Client();
var messageLawlzer; 

bot.on('ready', () => { // When our bot is ready:
  bot.user.setActivity("with myself");
  // https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=setActivity
  // bot.user.setActivity('YouTube', { type: 'WATCHING' })
  // .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  // .catch(console.error);
  console.log('Bot running.');
  
  bot.fetchUser('206980947298615297', false).then((user) => {
    messageLawlzer = user; 
  });
  
});

bot.on('message', async message => {
  if (message.author.bot) {
    return; //if the author of the message is the bot, do nothing.
  }

  if (!message.guild) { //If the message is sent via DMs.
    message.reply('Please do not message this bot in DMs. Please do !help in a public channel, or add Lawlzer on Discord for help. Lawlzer#4013')
    return;
  }

  // if (message.guild.id == '547192605927145481') {
  //   console.log('Message sent in the main bot channel - Response refused.');
  //   return;
  // }

  //exports.getOrCreateDatabase = getOrCreateDatabase;


  await (async function executeCommand() {
    const database = await databaseController.getOrCreateDatabase(message.guild.id);
    var commandPrefix = database.commandPrefix;
    var commandName = message.content.toLowerCase();

    if (!commandName.startsWith(commandPrefix)) {
      return;
    }

    commandName = commandName.replace(commandPrefix, ''); // get rid of the prefix
    commandName = commandName.split(' ');

    if (commandName[0] == '') { commandName.shift(); } // if we have a command with a space inbetween the prefix and the command
    // e.g "! ping" - this will remove the space
    // the commandName is probably only the first word, so we split it up by spaces, then take the first word. (needed if we have args/whatever)

    commandName = commandName[0];
    var argsLowercase = message.content.toLowerCase();
    argsLowercase = argsLowercase.replace(commandPrefix, '');
    argsLowercase = argsLowercase.replace(commandName, '');
    argsLowercase = argsLowercase.split(' ');


    if (await findUserCommand(database, commandName, bot, message) == true) {
      // this command will return "true" if it finds a user created command and will then send the message to the channel
      return; 
    }


    var commandNames = Object.keys(convertKeysToLowerCase(commands)); // get all the names in lowercase, so we can search them

    if (!commandNames.includes(commandName)) {
      return;
    }

    var indexOfCommand = commandNames.indexOf(commandName); // get the INDEX of the correct command, then use that for everything else, since capitalization is probably wrong

    var commandsArray = [];
    for (var i in commands) { // make a commandsArray so we can go to the index of it
      commandsArray.push(commands[i]);
    }
    const command = commandsArray[indexOfCommand];

    if (!!command.requirements) {
      for (let i = 0; i <= command.requirements.length - 1; i++) {
        if (!await command.requirements[i](bot, message, argsLowercase, content)) {
          console.log('The requirement: "' + commandName + '" has failed');
          return;
        }
      }
    }
    try {
      var content = message.content;
      content = content.replace(commandPrefix, '');
      content = content.replace(commandName, '');

      if (argsLowercase[0] == '') { argsLowercase.shift(); } // if the 0th array in the array is empty, this removes it.

      var result = await command.execute(bot, message, argsLowercase, content);

      if (!!result && result.hasOwnProperty('then') && typeof result.then === 'function') {
        result = await result;
      }
    } catch (e) {
      message.channel.send(await databaseController.returnErrorEmbed(bot, message, 'ERROR', 'You should never see this... Uhhh.. Sorry. To sate your curiousity, here\'s the error.\n' + e.message));
      if (production) {
        messageLawlzer.send(await databaseController.returnErrorEmbed(bot, message, 'ERROR', 'Error found in production code... That\'s not good.\n' + e.message)); 
      }

    }

  })();
});

const token = process.env.DISCORD_BOT_SECRET;
bot.login(token);



function convertKeysToLowerCase(obj) {
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
  var output = {};
  for (i in obj) {
    if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
      output[i.toLowerCase()] = convertKeysToLowerCase(obj[i]);
    } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
      output[i.toLowerCase()] = [];
      output[i.toLowerCase()].push(convertKeysToLowerCase(obj[i][0]));
    } else {
      output[i.toLowerCase()] = obj[i];
    }
  }
  return output;
};

async function findUserCommand(database, inputCommand, bot, message) {
  var allCommands = database.userCreatedCommands; 
  for (let i = 0; i < allCommands.length; i++) {
    if (inputCommand == allCommands[i].commandTrigger) {
      await message.channel.send(await databaseController.returnEmbed(bot, message, allCommands[i].commandTrigger, allCommands[i].commandDescription));
      return true; 
    }
  }
  return false; // return false so we don't do anything when returning this function
} 