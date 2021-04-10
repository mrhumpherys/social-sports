const router = require('express').Router();
const sequelize = require('../config/connection');
const { Games, User, Comment, Vote } = require('../models');
const NBA = require('../nba');
const withAuth = require('../utils/auth');

router.get(`/`, withAuth, (req, res) => {
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