const mongoose = require('mongoose');

const databaseSchema = new mongoose.Schema({
  serverId: { type: String, required: true, unique: true },
  adminRoleId: { type: String },
  chatLogId: { type: String },
  commandPrefix: { type: 'String', required: true },

  userCreatedCommands: [{ type: 'Object'}],
//   newCommand = {
//     commandTrigger: commandTrigger,
//     commandDesciption: commandDescription,
//  }

}, { timestamps: true });

const Database = mongoose.model('Database', databaseSchema);

module.exports = Database;  