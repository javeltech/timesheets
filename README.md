# # Timesheets

A simple timesheet application

## Scenario

Vertis Technology Solutions needs a simple time sheet Web Application. The purpose of
this application is to help log overtime for in office employees and to track billing hours for
contractors.

## Requirements

* Users should be able to login into the application.
* Users should be presented with a time sheet form.
* Users should be able to enter the following information: work title, client, date, start time, end time and comments.
* The application should calculate and display, the total time for each period, when user submits form.
* The application should display user profile information (user’s name and email address).
* The application should display client information (manager’s name and position).
* The user should be able to submit the timesheet and receive confirmation of submission (time stamp).
* The application should provide success and error messages.
* The application should provide necessary input validation.
* The application should be responsive.

## Database

* The MongoDB database was used for persistent storage of relevant data.

```javascript
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
```
```javascript
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
```

```javascript
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
```

## Presentation Layer

* The presentation layer was implemented with HTML, CSS, JavaScript, Bootstrap and Handlebars. The presentation layer was rendered from the server via server side rendering.

## Application Layer

* The application layer was implemented with Node.js and Express.js

## Deployment

The application was packaged with git and deployed via heroku:

https://warm-lake-44444.herokuapp.com/

Login Information:

email: javelawilson@gmail.com 
password: 1234567
