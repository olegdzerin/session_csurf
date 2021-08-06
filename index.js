var express = require('express');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var csrf = require('csurf');
// var csrfProtection = csrf({cookie: true});
var csrfProtection = csrf();

var app = express();
var exphbs = require('express-handlebars');
var handlebarsSolution = require('handlebars');
var {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
var numExpectedSources = 2;

var store = new MongoDBStore(
  {
    uri: 'mongodb+srv://olegzajac:moskva3504@cluster0.8sbw5.mongodb.net/connect_mongodb_session_test?retryWrites=true&w=majority',
    databaseName: 'connect_mongodb_session_test',
    collection: 'mySessions'
  },
  function(error) {
    // Should have gotten an error
  });

store.on('error', function(error) {
  // Also get an error here
});
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(handlebarsSolution),
  helpers: require('./utils/hbs-helpers.js')
});
app.engine("hbs", hbs.engine); // региструем в express наличие движка handlebars
app.set("view engine", "hbs"); // тут уже его используем
app.set("views", "views"); // первый параметр - название переменной, второй - название папки где будут храниться все шаблоны

//app.use(csurf());
// app.use(express.static(path.join(__dirname, "public"))); 
app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));

app.get('/', function(req, res) {
 
  res.send('Hello ' + JSON.stringify(req.session));
});
app.get('/form', csrfProtection, function (req, res) {
  // pass the csrfToken to the view
  res.render('send', { csrfToken: req.csrfToken(), sessCookie: JSON.stringify(req.session.cookie) })
})

server = app.listen(3000);