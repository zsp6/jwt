const db = require('../config/db');
const schema = new db.Schema({
  userId: String,
  money: String
})
module.exports = db.model('money', schema);
