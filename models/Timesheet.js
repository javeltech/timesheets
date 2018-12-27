const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timesheetSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  comments: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Timesheet', timesheetSchema);


