const router = require('express').Router();

const userRoutes = require('./user-routes.js');
// TURN THESE ON LATER FOR COMMENTS AND POSTS WILL BE FOR THE GAMES 
const gamesRoutes = require('./games-routes');
const commentsRoutes = require('./comment-routes');

router.use('/users', userRoutes);
router.use('/games', gamesRoutes);
router.use('/comments', commentsRoutes);

module.exports = router;