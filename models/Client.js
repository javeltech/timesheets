const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  manager: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    }
  }
})

module.exports = mongoose.model('Client', clientSchema);
