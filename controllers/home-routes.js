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
  // let games = await Games.findAll();
  // games = games.map(game => game.get({ plain: true }));
  let games = JSON.parse(fs.readFileSync('./data/games.json'));
  let game = games.filter(game => game.GameID == req.params.id)[0];
  res.render('game', { game });
});

module.exports = router;
