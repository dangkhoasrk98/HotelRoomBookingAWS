var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
const localStrategy = require('passport-local').Strategy;

var homeRouter = require('./routes/home');
var booknowStaffRouter = require('./routes/booknowStaff');
var booknowAdminRouter = require('./routes/booknowAdmin');
var aboutRouter = require('./routes/about');
var blogRouter = require('./routes/blog');
var roomRouter = require('./routes/rooms');
var contactRouter = require('./routes/contact');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var changeroominformationRouter = require('./routes/changeroominformation');
var staffManagerRouter = require('./routes/staffManager');
var paymentStaffRouter = require('./routes/paymentStaff');
var paymentAdminRouter = require('./routes/paymentAdmin');
var homeAdminRouter = require('./routes/homeAdmin');
var homeStaffRouter = require('./routes/homeStaff');
var roomsStaffRouter = require('./routes/roomsStaff');
var roomsAdminRouter = require('./routes/roomsAdmin');
var infocustomerStaffRouter = require('./routes/infocustomerStaff');
var infocustomerAdminRouter = require('./routes/infocustomerAdmin');
var changestaffinformationRouter = require('./routes/changestaffinformation');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secretString'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());
app.use(function(req, res, next){
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', homeRouter);
app.use('/about', aboutRouter);
app.use('/blog', blogRouter);
app.use('/booknowStaff', booknowStaffRouter);
app.use('/booknowAdmin', booknowAdminRouter);
app.use('/contact', contactRouter);
app.use('/rooms', roomRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/changeroominformation', changeroominformationRouter);
app.use('/staffManager', staffManagerRouter);
app.use('/paymentStaff', paymentStaffRouter);
app.use('/paymentAdmin', paymentAdminRouter);
app.use('/homeAdmin', homeAdminRouter);
app.use('/homeStaff', homeStaffRouter);
app.use('/roomsStaff', roomsStaffRouter);
app.use('/roomsAdmin', roomsAdminRouter);
app.use('/infocustomerStaff', infocustomerStaffRouter);
app.use('/infocustomerAdmin', infocustomerAdminRouter);
app.use('/changestaffinformation', changestaffinformationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
