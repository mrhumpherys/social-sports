const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Games, User, Comment, Vote } = require('../../models');



router.get('/', (req, res) => {

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
  // +-----------------------------------------------------------------------------------+//
  // |MAIN LOGIC IN OF API CALLS AND RETURNING THE DATA FOR GAMES TO THE DATABASE DO NOT |//
  // |I REPEAT DO NOT F**K WITH ANYTHING IN HERE WITH OUT ASKING SOMEONE                 |//
  // +-----------------------------------------------------------------------------------+//
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

  const NBA = require('../../nba');
  const moment = require('moment');
  let date = (moment(new Date()).format("YYYY-MM-DD"));

// ADDED COUNT VISIT TO LIMIT USER LIVE SCORES TO LESS THAN 100 PER LOGIN, THEY CAN PAY FOR MORE!!!
// LIVE SCORES WILL NOW ONLY LOAD ON SERVER START ONE CHECK AND THEN YOU MUST BE LOGGED IN
  // CHECK FOR LIVE GAMES
  // if (req.session.countVisit) {
  //       // If the 'countVisit' session variable exists, increment it by 1 and set the 'firstTime' session variable to 'false'
  //       req.session.countVisit++
  //       req.session.firstTime = false
  //       if(require.session<100){
  //           new NBA().isLive()
  //       }
  //     } else {
  //       // If the 'countVisit' session variable doesn't exist, set it to 1 and set the 'firstTime' session variable to 'true'
  //       req.session.countVisit = 1;
  //       req.session.firstTime = true;
  //       new NBA().isLive()
  //   }

  new NBA().isLive()

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
  // AFTER CHECKING DATA GET GAMES FROM DATABASE



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
    .then(dbPostData => {

      res.json(dbPostData)
      console.log('============================================================================================');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  if(req.session.countVisit){
    req.session.countVisit++
    
}else{
    require.session.countVisit=1;
    
}
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
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Game found with this id' });
        return;
      }
      // countVisit: req.session.countVisit
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // expects {game_id: 16241, user_id: 1}
  Games.create({
    game_id: req.body.game_id,
    user_id: req.body.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/upvote', (req, res) => {
  // custom static method created in models/Post.js

  Games.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
    .then(updatedVoteData => res.json(updatedVoteData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Games.update(
    req.body,
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Game found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Games.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No Game found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;