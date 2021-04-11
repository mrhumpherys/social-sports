const router = require('express').Router();
const sequelize = require('../config/connection');
const { Games, User, Comment, Vote } = require('../models');
const NBA = require('../nba');
const withAuth = require('../utils/auth');
const { Op } = require("sequelize");


router.get('/', (req, res) => {
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
  // +-----------------------------------------------------------------------------------+//
  // |MAIN LOGIC IN OF API CALLS AND RETURNING THE DATA FOR GAMES TO THE DATABASE DO NOT |//
  // |I REPEAT DO NOT F**K WITH ANYTHING IN HERE WITH OUT ASKING SOMEONE                 |//
  // +-----------------------------------------------------------------------------------+//
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

  const NBA = require('../nba');
  new NBA().create();
  new NBA().updateScores()




  // CHECK IF WE HAVE GAME DATA
  // ==========================
  async function create() {
    // check for game data
    let data = new NBA().needGames();
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
        
        // SOMETIMES THIS RETURNS DATA SOMETIMES IT JUST FRICKEN SPINS, TRIED TO CATCH IT AND STOP IT BUT I THINK THE CONNECTION TO MYSQL IS CRAP AND WE HAVE LIKE OVER 1K RECORDS BC OF THE LIVE UPDATES
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
          // const game = dbGamesData.map(game => game.get({ plain: true }));
          const data = JSON.stringify(dbGamesData);
          const games = JSON.parse(data)
          // console.log(games)
          // TO ACCESS INFO FOR HANDLEBARS USE game and news
          // ==============================================
          res.render('homepage', {
            style: "style.css",
            games, news,
            loggedIn: req.session.loggedIn,

          });
          // ==============================================
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
      // .finally(()=>sequelize.connectionManager.close()).then(() => console.log('shut down gracefully'))

    });

});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login', {
    style: "login-signup.css",
  });
});
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup', {
    style: "login-signup.css",
  });
});

router.get('/game/:id', withAuth, (req, res) => {
  
 new NBA().updateScores()
  Games.findOne({
    where: {
      id: req.params.id
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
        order: [['created_at', 'DESC']],
        attributes: ['id', 'comment_text', 'games_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Game found with this id' });
        return;
      }
      let game = dbPostData.get({ plain: true })
      let id = req.params.id
      res.render(`game`, {
        style: "style.css",
        id,
        game,
        loggedIn: true,
        username: req.session.username
      });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });

});
module.exports = router;