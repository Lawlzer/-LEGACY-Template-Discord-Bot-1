const databaseController = require('../lib/database');

exports.admin = async function (bot, message, argsLowercase, content) {
  const database = await databaseController.getOrCreateDatabase(message.guild.id);
  if (!database.adminRoleId) {
    const embed = await databaseController.returnErrorEmbed(message, bot, 'ERROR', 'There is no admin role ID set. Please set the role ID of the admin role. Example: !setAdminRole @BotAdmins.');
    message.reply(embed);
    return;
  }

  if (message.member.roles.some(role => role.id == database.adminRoleId)) {
    return true;
  }
  const embed = await databaseController.returnErrorEmbed(message, bot, 'ERROR', 'You must be an admin to run this command.');
  message.reply(embed);;
  return false;
}

exports.oneArgument = async function (bot, message, argsLowercase, content) {
  if (argsLowercase.length < 1) {
    const embed = await databaseController.returnErrorEmbed(message, bot, 'ERROR', 'You must provide at least one argument to use this command. Example: ' + command.example);
    message.reply(embed);
    return false;
  }
  return true;
}

exports.twoArguments = async function (bot, message, argsLowercase, content) {
  if (argsLowercase.length < 2) {
    const embed = await databaseController.returnErrorEmbed(message, bot, 'ERROR', 'You must provide at least two arguments to use this command. Example: ' + command.example);
    message.reply(embed);
    return false;
  }
  return true;
}