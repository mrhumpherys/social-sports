const User = require("./User");
const Games = require("./Games");
const Vote = require('./Vote');
const Comment = require('./Comment')

// create associations


User.belongsToMany(Games, {
    through: Vote,
    as: 'voted_games',
    foreignKey: 'user_id'
});

Games.belongsToMany(User, {
    through: Vote,
    as: 'voted_games',
    foreignKey: 'post_id'
});
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Games, {
    foreignKey: 'games_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Games.hasMany(Vote, {
    foreignKey: 'games_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Games, {
    foreignKey: 'games_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Games.hasMany(Comment, {
    foreignKey: 'games_id'
});

module.exports = { User, Games, Vote, Comment };