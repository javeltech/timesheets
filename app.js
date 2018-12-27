const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();
const port = 5000;

const Client = require('./models/Client');
const User = require('./models/User');


// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// load routes
const users = require('./routes/users');
const timesheets = require('./routes/timesheets');

// express handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    areEqual: function(value1, value2, options){
      if(value1 && value2){
        if(value1.toString() == value2.toString()){
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      }
      
    }
  }
  }));
app.set('view engine', 'handlebars');

// mongoose middleware
let remoteDB = 'mongodb://javel:Tim3sh33t!1@ds243054.mlab.com:43054/timesheets';
let localDB = 'mongodb://localhost/timesheets';
mongoose.connect(remoteDB, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// passport config
require('./config/passport')(passport);



// body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash middleware
app.use(flash());

// method override middleware
app.use(methodOverride('_method'));

// // create client
// app.use((req, res, next) => {
//   const client = new Client({
//     name: 'JMMB',
//     manager: {
//       firstName: 'Mario',
//       lastName: 'Murray',
//       position: 'General Manager'
//     }
//   })
//   client.save()
//     .then(client => {
//       console.log(client)
//       console.log('Test')
//     })
//     .catch(err => console.log(err))
//   next();
// });

// // create user
// app.use((req, res, next) => {
//   const user = new User({
//     firstName: 'Javel',
//     lastName: 'Wilson',
//     email: 'nashaawilson@gmail.com',
//     password: '1234567'
//   });

//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if(err) throw err;
//       user.password = hash;
//       user.save()
//         .then(user => {
//           console.log(user);
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     });
//   });
//   next();
// });

// global variables
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// index route
app.get('/', (req, res) => {
  res.render('index');
});

// users routes
app.use('/users', users);
// timesheets routes
app.use('/timesheets', timesheets);

// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});