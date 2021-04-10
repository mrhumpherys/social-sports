const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Games, User, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth');



router.get('/', (req, res) => {

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
  // +-----------------------------------------------------------------------------------+//
  // |MAIN LOGIC IN OF API CALLS AND RETURNING THE DATA FOR GAMES TO THE DATABASE DO NOT |//
  // |I REPEAT DO NOT F**K WITH ANYTHING IN HERE WITH OUT ASKING SOMEONE                 |//
  // +-----------------------------------------------------------------------------------+//
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

  const NBA = require('../../nba');
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
      new NBA().createGames(date).then(()=>{
        return
      });
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
        order: [['created_at', 'DESC']],
        include: {
          model: User,
          attributes: ['username']
        },
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
  const NBA = require('../../nba');
  new NBA().updateScores().then(()=>{
    return
  })
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

      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  // expects {game_id: 16241, user_id: 1}
  Games.create({
    game_id: req.body.game_id,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/upvote', withAuth, (req, res) => {
  // custom static method created in models/Post.js

  Games.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, User })
    .then(updatedVoteData => res.json(updatedVoteData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
      return
    });
});

router.put('/:id', withAuth,(req, res) => {
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

router.delete('/:id',withAuth, (req, res) => {
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