const express = require('express');
const router = express.Router();
const moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");
// access control middleware
const {
  ensureAuthenticated
} = require('../helpers/auth');

// load timesheet and client model
const Timesheet = require('../models/Timesheet');
const Client = require('../models/Client');

// add time (get)
router.get('/add', ensureAuthenticated, (req, res) => {
  // today's date
  let start = new Date();
  start.setHours(0, 0, 0, 0);
  let end = new Date();
  end.setHours(23, 59, 59, 999);

  Timesheet.find({
      // find times for today's date
      date: {
        $gte: start,
        $lt: end
      },
      user: req.user._id
    })
    .populate('client') // get client data
    .exec()
    .then(timesheets => {
      let total = 0;
      let client;
      // format timesheet data for display
      let newTimesheets = timesheets.map(timesheet => {
        total += timesheet.duration;
        // if client for timesheet is deleted set to unknown
        if (!timesheet.client) {
          client = 'Unknown Client'
        } else {
          client = `${timesheet.client.name} - ${timesheet.client.manager.firstName} ${timesheet.client.manager.lastName} - ${timesheet.client.manager.position}`
        }
        return {
          _id: timesheet._id,
          task: timesheet.task,
          client: client,
          date: moment(timesheet.date).format("MMM Do YY"),
          startTime: moment(timesheet.startTime).format('LT'),
          endTime: moment(timesheet.endTime).format('LT'),
          comments: timesheet.comments,
          duration: moment.duration(timesheet.duration).format("h [hrs], m [min]")
        }
      });

      if (total === 0) {
        totalTime = '0 hrs 0 min'
      } else {
        totalTime = moment.duration(total).format("h [hrs], m [min]");
      }

      Client.find({})
        .then(clients => {
          let clientList = clients.map(client => {
            return {
              value: client._id,
              text: `${client.name} - ${client.manager.firstName} ${client.manager.lastName} - ${client.manager.position}`
            }
          })
          res.render('timesheets/add', {
            timesheets: newTimesheets,
            total: totalTime,
            clients: clientList
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.post('/add', ensureAuthenticated, (req, res) => {
  Timesheet.find({
      user: req.user._id
    })
    .then(timesheets => {
      // server side validation
      let errors = [];

      if (!req.body.task) {
        errors.push({
          text: 'Please provide a tas',
          task: true
        });
      }
      if (!req.body.client) {
        errors.push({
          text: 'Please provide a client',
          client: true
        });
      }
      if (!req.body.date) {
        errors.push({
          text: 'Please provide a date',
          date: true
        });
      }
      if (new Date(req.body.date) > Date.now()) {
        errors.push({
          text: 'Please provide a valid date',
          validDate: true
        });
      }
      if (!req.body.startTime) {
        errors.push({
          text: 'Please provide a start time',
          startTime: true
        });
      }
      if (!req.body.endTime) {
        errors.push({
          text: 'Please provide an end time',
          endTime: true
        });
      }

      if (req.body.startTime && req.body.endTime && req.body.date) {

        let startTime = new Date(`${req.body.date} ${req.body.startTime}:00`);
        let endTime = new Date(`${req.body.date} ${req.body.endTime}:00`);
        if (timesheets.length > 0) {
          for (let i = 0; i <= timesheets.length; i++) {
            console.log(timesheets[i])
            if ((startTime >= timesheets[i].startTime && startTime <= timesheets[i].endTime) || (endTime >= timesheets[i].startTime && endTime <= timesheets[i].endTime)) {
              console.log('error')
              errors.push({
                text: 'Please provide a valid start or end time - a previous task was completed during this period',
                validTime: true
              });
              break
            }


          }
        }


        if (startTime > Date.now()) {
          errors.push({
            text: 'Please provide a valid start time - the time provided is in the future',
            validStartTime: true
          });
        }

        if (endTime > Date.now()) {
          errors.push({
            text: 'Please provide a valid end time - the time provided is in the future',
            validEndTime: true
          });
        }

        if (req.body.startTime >= req.body.endTime) {
          errors.push({
            text: 'Please provide a valid start or end time',
            validTime: true
          });
        }





      }






      console.log(errors)


      if (errors.length > 0) {
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        let end = new Date();
        end.setHours(23, 59, 59, 999);

        Timesheet.find({
            date: {
              $gte: start,
              $lt: end
            },
            user: req.user._id
          })
          .populate('client')
          .exec()
          .then(timeSheets => {
            let total = 0;
            let newTimesheets = timeSheets.map(timesheet => {
              total += timesheet.duration;

              return {
                _id: timesheet._id,
                task: timesheet.task,
                client: `${timesheet.client.name} - ${timesheet.client.manager.firstName} ${timesheet.client.manager.lastName} - ${timesheet.client.manager.position}`,
                date: moment(timesheet.date).format("MMM Do YY"),
                startTime: moment(timesheet.startTime).format('LT'),
                endTime: moment(timesheet.endTime).format('LT'),
                comments: timesheet.comments,
                duration: moment.duration(timesheet.duration).format("h [hrs], m [min]")
              }
            });

            if (total === 0) {
              totalTime = '0 hrs 0 min'
            } else {
              totalTime = moment.duration(total).format("h [hrs], m [min]");
            }

            Client.find({})
              .then(clients => {
                let clientList = clients.map(client => {
                  return {
                    value: client._id,
                    text: `${client.name} - ${client.manager.firstName} ${client.manager.lastName} - ${client.manager.position}`
                  }
                })
                res.render('timesheets/add', {
                  errors: errors,
                  task: req.body.task,
                  client: req.body.client,
                  date: req.body.date,
                  startTime: req.body.startTime,
                  endTime: req.body.endTime,
                  comments: req.body.comments,
                  timesheets: newTimesheets,
                  total: totalTime,
                  clients: clientList
                });
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));

      } else {
        let date = new Date(`${req.body.date}T05:00:00.000Z`);
        let startTime = new Date(`${req.body.date} ${req.body.startTime}:00`);
        let endTime = new Date(`${req.body.date} ${req.body.endTime}:00`);
        let duration = endTime.getTime() - startTime.getTime()

        const timesheet = new Timesheet({
          user: req.user._id,
          task: req.body.task,
          client: req.body.client,
          date: date,
          startTime: startTime,
          endTime: endTime,
          comments: req.body.comments,
          duration: duration
        });
        timesheet.save()
          .then(timesheet => {
            req.flash('success_msg', 'The time was successfully submitted')
            res.redirect('/timesheets/add');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err))

});

// edit (get)
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Timesheet.findOne({
      _id: req.params.id
    })
    .then(timesheet => {
      Client.find({})
        .then(clients => {
          let clientList = clients.map(client => {
            return {
              value: client._id,
              text: `${client.name} - ${client.manager.firstName} ${client.manager.lastName} - ${client.manager.position}`
            }
          })
          res.render('timesheets/edit', {
            _id: timesheet._id,
            task: timesheet.task,
            client: timesheet.client,
            date: moment(timesheet.date).format('YYYY-MM-DD'),
            startTime: moment(timesheet.startTime).format('HH:mm'),
            endTime: moment(timesheet.endTime).format('HH:mm'),
            comments: timesheet.comments,
            clients: clientList
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
});

// edit put
router.put('/edit/:id', (req, res) => {
  let errors = [];

  if (!req.body.task) {
    errors.push({
      text: 'Please provide a task',
      task: true
    });
  }
  if (!req.body.client) {
    errors.push({
      text: 'Please provide a client',
      client: true
    });
  }
  if (!req.body.date) {
    errors.push({
      text: 'Please provide a date',
      date: true
    });
  }
  if (!req.body.startTime) {
    errors.push({
      text: 'Please provide a start time',
      startTime: true
    });
  }
  if (!req.body.endTime) {
    errors.push({
      text: 'Please provide an end time',
      endTime: true
    });
  }
  if (req.body.startTime > req.body.endTime) {
    errors.push({
      text: 'Please provide a valid start or end time',
      validTime: true
    });
  }

  if (errors.length > 0) {
    Client.find({})
      .then(clients => {
        let clientList = clients.map(client => {
          return {
            value: client._id,
            text: `${client.name} - ${client.manager.firstName} ${client.manager.lastName} - ${client.manager.position}`
          }
        })
        res.render('timesheets/edit', {
          _id: req.params.id,
          errors: errors,
          task: req.body.task,
          client: req.body.client,
          date: req.body.date,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          comments: req.body.comments,
          clients: clientList
        });
      })
      .catch(err => console.log(err));

  } else {
    Timesheet.findOne({
        _id: req.params.id
      })
      .then(timesheet => {
        let date = new Date(`${req.body.date}T05:00:00.000Z`);
        let startTime = new Date(`${req.body.date} ${req.body.startTime}:00`);
        let endTime = new Date(`${req.body.date} ${req.body.endTime}:00`);
        let duration = endTime.getTime() - startTime.getTime()


        timesheet.task = req.body.task;
        timesheet.client = req.body.client;
        timesheet.date = date;
        timesheet.startTime = startTime;
        timesheet.endTime = endTime;
        timesheet.comments = req.body.comments;
        timesheet.duration = duration;
        timesheet.save()
          .then(timesheet => {
            res.redirect('/timesheets/add');
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err))
  }
});

// delete (get)
router.get('/delete/:id', ensureAuthenticated, (req, res) => {
  Timesheet.findOne({
      _id: req.params.id
    })
    .then(timesheet => {
      Client.find({})
        .then(clients => {
          let clientList = clients.map(client => {
            return {
              value: client._id,
              text: `${client.name} - ${client.manager.firstName} ${client.manager.lastName} - ${client.manager.position}`
            }
          })
          res.render('timesheets/delete', {
            _id: timesheet._id,
            task: timesheet.task,
            client: timesheet.client,
            date: moment(timesheet.date).format('YYYY-MM-DD'),
            startTime: moment(timesheet.startTime).format('HH:mm'),
            endTime: moment(timesheet.endTime).format('HH:mm'),
            comments: timesheet.comments,
            clients: clientList
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
});

// delete 
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {

  Timesheet.findOne({
      _id: req.params.id
    })
    .then(timesheet => {
      timesheet.remove()
        .then(timesheet => {
          res.redirect('/timesheets/add');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
});




module.exports = router;