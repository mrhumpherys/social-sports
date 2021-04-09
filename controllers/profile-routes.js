const router = require('express').Router();
const sequelize = require('../config/connection');
const { Games, User, Comment, Vote } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Games,
              attributes: ['id']
            }
          },
          {
              model: Games,
              attributes: ['game_id'],
              through: Vote,
              as: 'voted_games'
          },
        ]
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.render('profile', {
            style: "style.css",
            loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;