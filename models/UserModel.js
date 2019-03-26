const db = require('../config/db');
const schema = new db.Schema({
  userName: String,
  passWord: String
})
module.exports = db.model('user', schema);
