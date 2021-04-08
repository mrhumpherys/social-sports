const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const NBA = require('./nba')
const moment = require('moment');
const Games = require('./models/Games')
const deleteFiles = require('./json-file-maintenance')


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
        db: sequelize
    })
};
const helpers = require('./utils/helpers');
const { time } = require('console');
const hbs = exphbs.create({ helpers });
const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

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

// DO NOT REMOVE THE CODE BELOW IF YOU DONT UNDERSTAND WHAT IT DOES ASK! - ANTHONY

async function create() {
    // check for game data
    data = new NBA().needGames();
    console.log('============================================================================================');
    console.log("CREATE GAMES?", data)
    console.log('============================================================================================');
    // if no game data, run api call and create games in database
    if (data === false) {

        return

    } else {
        let date = (moment(new Date()).format("YYYY-MM-DD"))
        new NBA().createGames(date);

    }
}



deleteFiles()
create()

new NBA().isLive()
    .then(inProgress => {

        inProgress.map(el => {
            let status = el.status
            let homeTeam = el.home_team;
            let awayTeam = el.away_team;
            let dateTimes = moment(el.date_time).format()
            let format = dateTimes.split('T')[1]
            let hours = format.split(":")[0]
            let minutes = format.split(":")[1]
            // let times = dateTimes.split('T')[1]
            // let gameTime = times

            if (dateTimes <= moment(new Date())) {
                if(status ==='InProgress'){
                    console.log('============================================================================================');
                    console.log(`The ${homeTeam} vs. ${awayTeam} GAME IS LIVE! UPDATING SCORES!`)
                    console.log('============================================================================================');
                    new NBA().getGames();
                    new NBA().updateGames();
                    return true
                } if(status ==="Final"){
                    console.log('============================================================================================');
                    console.log(`The ${homeTeam} vs. ${awayTeam} GAME IS OVER`)
                    console.log('============================================================================================');
                }
            } else {
                console.log('============================================================================================');
                console.log(`The ${homeTeam} vs. ${awayTeam} GAME IS NOT LIVE! \nGAME TIME IS SCHEDULED AT ${hours}:${minutes}!`)
                console.log('============================================================================================');
                return false
            }
        })

        // if (inProgress.length > 0) {
        //     console.log('============================================================================================');
        //     console.log('LIVE GAMES FOUND! UPDATING GAMES!')
        //     console.log('============================================================================================');
        //     new NBA().getGames();
        //     new NBA().updateGames();
        // } else {
        //     console.log('============================================================================================');
        //     console.log('NO GAMES ARE CURRENTLY LIVE!')
        //     console.log('============================================================================================');
        // }
    }).catch(e => {
        console.log(e)
        return
    })