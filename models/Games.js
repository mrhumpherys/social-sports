//AKA POSTS
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Games extends Model {
    // MODIFIED THE VOTE MODEL TO TRACK VOTES ON THE GAMES
    // ============================================================
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            games_id: body.games_id
        }).then(() => {
            return games.findOne({
                where: {
                    id: body.games_id
                },
                attributes: [
                    'id',
                    'game_id',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE games.id = vote.games_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
    // ========================================================================================================
    // MIGHT NEED TO BE RE-WORKED HAVE NOT YET TESTED
}


// create fields/columns for Games model
Games.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        game_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'games'
    }
);

module.exports = Games;