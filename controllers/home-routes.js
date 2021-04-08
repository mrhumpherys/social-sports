const router = require('express').Router();
const fs = require('fs');
const { User, Games, Vote, Comment } = require('../models');

router.get('/', async (req, res) => {
  // let games = await Games.findAll();
  // games = games.map(game => game.get({ plain: true }));
  // console.log(games);
  let games = JSON.parse(fs.readFileSync('./data/games.json'));
  let teams = JSON.parse(fs.readFileSync('./data/teams.json'));
  let teamNameFromID = new Map();
  a = teams.forEach(team => teamNameFromID.set(team.TeamID, team.Name));
  console.log(a);
  res.render('index', { games, teams });
});

module.exports = router;
