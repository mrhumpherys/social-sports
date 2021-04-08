const router = require('express').Router();
const sequelize = require('../config/connection');
const { Games, User, Comment, Vote } = require('../models');


router.get('/', (req, res) => {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
    // +-----------------------------------------------------------------------------------+//
    // |MAIN LOGIC IN OF API CALLS AND RETURNING THE DATA FOR GAMES TO THE DATABASE DO NOT |//
    // |I REPEAT DO NOT F**K WITH ANYTHING IN HERE WITH OUT ASKING SOMEONE                 |//
    // +-----------------------------------------------------------------------------------+//
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

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
// GETS NEWS STORIES 
// ===============================================
    new NBA().getNews()
        .then(data => {
            const news = JSON.stringify(data)
            Games.findAll({
                attributes: [
                    'id',
                    'game_id',
                    'game_type',
                    'date_time',
                    "status",
                    'quarter',
                    'home_team_id',
                    'home_team',
                    "home_team_score",
                    'away_team_id',
                    'away_team',
                    "away_team_score",
                    'time_remaining_minutes',
                    'time_remaining_seconds',
                    "channel",
                    "quarters",
                    'created_at',
                    'updated',
                    'new_record_number',
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