const router = require('express').Router();
const sequelize = require('../config/connection');
const { Games, User, Comment, Vote } = require('../models');


router.get('/', (req, res) => {

    const NBA = require('../nba');
    const moment = require('moment');
    let date = (moment(new Date()).format("YYYY-MM-DD"));
    // CHECK IF WE HAVE GAME DATA
    // ==========================
    async function create() {
        // check for game data
        data = new NBA().needGames();

        console.log("CREATE GAMES?", data)
        // if no game data, run api call and create games in database
        if (data === false) {

            return

        } else {

            new NBA().createGames(date);

        }
    }

    create()

    new NBA().getNews()
        .then(data => {
            const news = JSON.stringify(data)
            Games.findAll({
                attributes: [
                    'id',
                    'game_id',
                    'game_type',
                    'day',
                    'day_time',
                    'updated',
                    'quarter',
                    'time_remaining_minutes',
                    'time_remaining_seconds',
                    'home_team',
                    'home_team_id',
                    "home_team_score",
                    "away_team_score",
                    "status",
                    "channel",
                    "quarters",
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE games.id = vote.games_id)'),
                        'vote_count'
                    ]
                ],
                include: [
                    {
                        model: Comment,
                        attributes: ['id', 'comment_text', 'games_id', 'user_id', 'created_at'],
                        include: {
                            model: User,
                            attributes: ['username']
                        }
                    },
                ]
            })
                .then(dbGamesData => {
                    const games = dbGamesData.map(game => game.get({ plain: true }));
                    // TO ACCESS INFO FOR HANDLEBARS USE game and news
                    // ==============================================
                    res.render('homepage', {
                        games, news,
                        loggedIn: req.session.loggedIn
                    });

                    // ==============================================
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });

        })


    new NBA().updateStats()
    //console.log('=============');

});


module.exports = router;