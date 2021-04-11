const router = require('express').Router();
const sequelize = require('../config/connection');
const { Games, User, Comment, Vote } = require('../models');
const withAuth = require('../utils/auth');
const { Op } = require("sequelize");

router.get('/', withAuth, (req, res) => {
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
    // +-----------------------------------------------------------------------------------+//
    // |MAIN LOGIC IN OF API CALLS AND RETURNING THE DATA FOR GAMES TO THE DATABASE DO NOT |//
    // |I REPEAT DO NOT F**K WITH ANYTHING IN HERE WITH OUT ASKING SOMEONE                 |//
    // +-----------------------------------------------------------------------------------+//
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

    const NBA = require('../nba');
    const moment = require('moment');
    let date = (moment(new Date()).format("YYYY-MM-DD"));


    // CHECK FOR LIVE GAMES
    new NBA().updateScores()

    // CHECK IF WE HAVE GAME DATA
    // ==========================
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
            new NBA().createGames(date);
        }
    }
    create()

    // GETS NEWS STORIES 
    // ===============================================
    new NBA().getNewsDb()
        .then(data => {
            const news = (data)
            Games.findAll({
                where:{
                    status: {
                      [Op.or]: ['InProgress', 'Scheduled', 'Postponed']
                    }
        
                        // [{status:'InProgress'},{status:'Scheduled'},{status:'Postponed'},]
        
                },
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

                    console.log('============================================================================================');
                    const games = dbGamesData.map(game => game.get({ plain: true }));

                    // TO ACCESS INFO FOR HANDLEBARS USE game and news
                    // ==============================================
                    res.render('dashboard', {
                        style: "style.css",
                        games, news,
                        loggedIn: true,
                        username: req.session.username
                    });

                    // ==============================================
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });

        })

});

router.get(`/profile`, withAuth, (req, res) => {
    User.findOne({
        where: {
            id: req.session.user_id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            const user = dbUserData.get({ plain: true })
            res.render(`profile`, {
                style: "style.css",
                user,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;