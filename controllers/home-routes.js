const router = require('express').Router();
const fs = require('fs');
const { User, Games, Vote, Comment } = require('../models');

router.get('/', async (req, res) => {
  // let games = await Games.findAll();
  // games = games.map(game => game.get({ plain: true }));
  // console.log(games);
  let games = JSON.parse(fs.readFileSync('./data/games.json'));
  res.render('index', { games });
});

router.get('/:id', async (req, res) => {
  // let game = await Games.findByPk(req.params.id);
  // game = game.get({ plain: true });
  // games = games.map(game => game.get({ plain: true }));
  let games = JSON.parse(fs.readFileSync('./data/games.json'));
  let game = games.filter(game => game.GameID == req.params.id)[0];
  game = {
    ...game,
    comments: [
      {
        user_id: 1,
        comment_text: 'the magic are never going to come back',
        user: {
          username: 'kurt',
        },
      },
      {
        user_id: 2,
        comment_text: 'Go Wizards!',
        user: {
          username: 'julius',
        },
      },
      {
        user_id: 3,
        comment_text: 'Nice Budweiser commercial!',
        user: {
          username: 'john',
        },
      },
    ],
  };
  console.log(game);
  res.render('game', { game });
});

module.exports = router;
