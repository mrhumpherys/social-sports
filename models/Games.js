//AKA POSTS
const { Model, DataTypes, Sequelize } = require('sequelize');
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
            return Games.findOne({
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
            allowNull: true,
            unique: true,
        },
        game_type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        day:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        day_time:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updated:{
            type: DataTypes.DATE,
            allowNull: true,
        },
        quarter: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        time_remaining_minutes:{
            type: DataTypes.INTEGER,
            allowNull: true,
            
        },
        time_remaining_seconds:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        home_team: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        home_team_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        home_team_score:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        away_team: {
            type: DataTypes.STRING,
            allowNull: true
        },
        away_team_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        away_team_score:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        quarters: {
            type: DataTypes.JSON,
            allowNull:true,
        }

        // user_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'user',
        //         key: 'id'
        //     }
        // }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'games'
    }
);

module.exports = Games;