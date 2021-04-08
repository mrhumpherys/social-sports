const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const NBA = require('./nba');
const moment = require('moment');

//IMPORT SESSIONS
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 300000 },
  resave: false,
  saveUninitialized: true,
  rolling: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
const helpers = require('./utils/helpers');
const hbs = exphbs.create({
  helpers,
  layoutsDir: __dirname + '/views/layouts',
  //new configuration parameter
  // extname: 'hbs',
});
const app = express();
const PORT = process.env.PORT || 3001;

//! TRYING TO CHANGE EXTENSION FROM .handlebars to .hbs
app.set('view engine', 'handlebars');
// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
app.engine('handlebars', hbs.engine);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}`));
});

// DO NOT REMOVE THE CODE BELOW IF YOU DONT UNDERSTAND WHAT IT DOES ASK!

async function create() {
  // check for game data
  data = new NBA().needGames();

  console.log('CREATE GAMES?', data);
  // if no game data, run api call and create games in database
  if (data === false) {
    return;
  } else {
    let date = moment(new Date()).format('YYYY-MM-DD');
    new NBA().createGames(date);
  }
}

create();
