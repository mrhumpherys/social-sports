require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');
const { Games } = require('./models');

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
// +-----------------------------------------------------------------------------------+//
// |MAIN LOGIC IN OF API CALLS AND RETURNING THE DATA FOR GAMES TO THE DATABASE DO NOT |//
// |I REPEAT DO NOT F**K WITH ANYTHING IN HERE WITH OUT ASKING SOMEONE                 |//
// +-----------------------------------------------------------------------------------+//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
class NBA {
    constructor() {
        this.data = [];
    }

    // CHECKS FOR OUR LOCAL JSON FILE IF NOT FOUND RUN API AND CREATE THE GAMES INTO THE DATABASE
    async create() {
        // check for game data
        let data = new NBA().needGames();
        console.log('============================================================================================');
        console.log("CREATE GAMES?", data)
        console.log('============================================================================================');
        // if no game data, run api call and create games in database
        if (data === false) {
            return
        } else {
            let date = (moment(new Date()).format("YYYY-MM-DD"))
            new NBA().getNews()
            return new NBA().createGames(date);
        }
    }

    // MAIN FUNCTION TO CREATE INSTANCES OF THE GAME IN THE DATABASE FROM DATA IN OUR DATA FILE FOLDER WHERE THE GAME DATA FOR EACH DAY WILL BE
    async createGames(date) {

        try {
            let response = JSON.parse(fs.readFileSync(`./data/games-${date}.json`, 'utf8',));
            let games = (response)
            console.log(games)
            let data = await games.map(el => {
                return {
                    game_id: el.GameID,
                    game_type: "basketball",
                    date_time: el.DateTime,
                    status: el.Status,
                    quarter: el.Quarter,
                    home_team_id: el.HomeTeamID,
                    home_team: el.HomeTeam,
                    home_team_score: el.HomeTeamScore,
                    away_team_id: el.AwayTeamID,
                    away_team: el.AwayTeam,
                    away_team_score: el.AwayTeamScore,
                    time_remaining_minutes: el.TimeRemainingMinutes,
                    time_remaining_seconds: el.TimeRemainingSeconds,
                    updated: el.Updated,
                    channel: el.Channel,
                    quarters: el.Quarters,
                }
            })
            // CREATE THE RECORDS IN BULK, DB WONT ALLOW DUPLICATES BUT CATCH THE ERROR
            Games.bulkCreate(data).catch(e => {
                console.log(e)
                return;
            });
        } catch (e) {
            if (e.errno === -4058) {
                console.log("FILE NOT FOUND CREATING GAMES!");
                // IF FILE NOT FOUND ERROR, GET GAMES- GET GAMES WILL FETCH THE API AND WRITE THE JSON TO A FILE IN THE DATA FOLDER
                try {
                    let response = await new NBA().getGames()
                    return response
                }
                catch (e) {
                    return console.log("This broke while attempting to run the get games inside the create game function inside the catch error", e)
                }
                finally {
                    // IF THE GET GAMES COMES BACK WITH OUT ERROR, RUN CREATE GAMES AGAIN TO LOAD THE DB 
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    return new NBA().createGames(date1)
                }
            } else {
                // AN ERROR NOT RELATED TO NOT FINDING THE FILE
                return console.log("THIS BROKE WHILE CREATING GAMES IN createGames() ", e)
            }
        }
    }

    // RETURNS CURRENT API GAME DATA FOR TODAY'S DATE
    async getGames() {
        // ALSO NEWS STORIES
        let date = (moment(new Date()).format("YYYY-MM-DD"));
        let response = await
            fetch(`https://fly.sportsdata.io/v3/nba/scores/json/GamesByDate/${date}`, {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.KEY
                }
            })
                .then(res => res.json())
                .then(json => {
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    const data = JSON.stringify(json);
                    fs.writeFileSync(`./data/games-${date1}.json`, data, 'utf8', (err) => {
                        if (err) {
                            return console.log(`Error writing file: ${err}`);
                        } else {
                            return console.log(`Game File is written successfully!`);
                        }
                    });
                });
                new NBA().getNews()
        return response
    }
    // GETS THE NEWS STORIES FROM THE API
    async getNews() {
        let response = await
            fetch(`https://fly.sportsdata.io/v3/nba/scores/json/News`, {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.KEY
                }
            })
                .then(res => res.json())
                .then(json => {
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    const data = JSON.stringify(json);
                    fs.writeFileSync(`./data/news-${date1}.json`, data, 'utf8', (err) => {
                        if (err) {
                            return console.log(`Error writing file: ${err}`);
                        } else {
                            return console.log(`Game File is written successfully!`);
                        }
                    });
                });
        return response
    }
    // THIS ONE MIGHT BE EXTRA LEAVING FOR NOW
    async getNewsDb() {
        let date2 = (moment(new Date()).format("YYYY-MM-DD"));
        let response = await JSON.parse(fs.readFileSync(`./data/news-${date2}.json`, 'utf8',));
        return response;
    };
    async getGamesDb() {
        let response = Games.findAll()
        return response
    };

    // RETURNS TRUE FALSE IF WE NEED TO UPDATE OUR DATABASE WITH NEW GAME INFORMATION FOR THE DAY
    needGames() {
    let date = (moment(new Date()).format("YYYY-MM-DD"));
        // RAN IT WITH TRY/CATCH TO CATCH THE ERROR WHEN THE FILE IS NOT FOUND
        try {
            let games = JSON.parse(fs.readFileSync(`./data/games-${date}.json`, 'utf8', (e) => {
                if (e.errno == -4058) {
                    console.log("FILE NOT FOUND CREATING GAMES!");
                    // IF FILE NOT FOUND ERROR, GET GAMES- GET GAMES WILL FETCH THE API AND WRITE THE JSON TO A FILE IN THE DATA FOLDER
                    return true
                } else {
                    console.log("Error while checking for games", e)
                    return true
                }
            }));
            if (!games) {
                return true
            } else {
                return false
            }
        }
        catch (e) {
            if (e.errno == -4058) {
                console.log("FILE NOT FOUND CREATING GAMES!");
                // IF FILE NOT FOUND ERROR, GET GAMES- GET GAMES WILL FETCH THE API AND WRITE THE JSON TO A FILE IN THE DATA FOLDER
                return true
            } else {
                console.log("Error while checking for games", e)
                return true
            }
        }
    }

    // USED FOR UPDATING THE LIVE SCORES 
    async updateGames(date) {
        try {
            let response = JSON.parse(fs.readFileSync(`./data/games-${date}.json`, 'utf8',));
            let games = (response)
            // console.log(games)
            let data = await games.map(el => {
                return {
                    game_id: el.GameID,
                    game_type: "basketball",
                    date_time: el.DateTime,
                    status: el.Status,
                    quarter: el.Quarter,
                    home_team_id: el.HomeTeamID,
                    home_team: el.HomeTeam,
                    home_team_score: el.HomeTeamScore,
                    away_team_id: el.AwayTeamID,
                    away_team: el.AwayTeam,
                    away_team_score: el.AwayTeamScore,
                    time_remaining_minutes: el.TimeRemainingMinutes,
                    time_remaining_seconds: el.TimeRemainingSeconds,
                    updated: el.Updated,
                    channel: el.Channel,
                    quarters: el.Quarters,
                    new_record_number: Date.now(),
                }
            })
            console.log(data)
            // CREATE THE RECORDS IN BULK, DB WONT ALLOW DUPLICATES BUT CATCH THE ERROR
            Games.bulkCreate(data, {
                fields: ['id',
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
                    'new_record_number',],
                updateOnDuplicate: [
                    "status",
                    'quarter',
                    "home_team_score",
                    "away_team_score",
                    'time_remaining_minutes',
                    'time_remaining_seconds',
                    "quarters",
                    'updated',
                    'new_record_number',]
            }).then(updateGameData => {
                if (!updateGameData) {
                    // console.log(updateGameData)
                    return
                } else {
                    console.log(updateGameData)
                    console.log("SUCCESS")
                    return;
                }
            }).catch(e => {
                console.log(e)
                return;
            });
        } catch (e) {
            if (e.errno == -4058) {
                console.log("FILE NOT FOUND CREATING GAMES!");
                // IF FILE NOT FOUND ERROR, GET GAMES- GET GAMES WILL FETCH THE API AND WRITE THE JSON TO A FILE IN THE DATA FOLDER
                try {
                    let response = await new NBA().getGames()
                    return response
                }
                catch (e) {
                    return console.log("This broke while attempting to run the get games inside the create game function inside the catch error", e)
                }
                finally {
                    // IF THE GET GAMES COMES BACK WITH OUT ERROR, RUN CREATE GAMES AGAIN TO LOAD THE DB 
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    return new NBA().updateGames(date1)
                }
            } else {
                // AN ERROR NOT RELATED TO NOT FINDING THE FILE
                return console.log("THIS BROKE WHILE CREATING GAMES IN createGames() ", e)
            }
        }
    }

    // IDEA FOR UPDATING SCORES ONLY WHEN GAMES ARE LIVE
    async isLive() {
        // CHECK OUR CURRENT LIST OF GAMES, IF ANY GAME OF THE GAMES 'status' property or key shows a value === 'InProgress' then run the function to update the scores
        async function inProgress() {
            const live = await Games.findAll({
            })
            return live
        }
        inProgress()
            .then(inProgress => {
                let runUpdate = false
                inProgress.map(el => {
                    let inProgressCounter = 1
                    inProgressCounter ++;
                    let homeTeam = el.home_team;
                    let awayTeam = el.away_team;
                    let dateTimes = moment(el.date_time).format()
                    let current = new Date()
                    let currentDate = moment(current).format()
                    if (dateTimes <= currentDate & inProgressCounter <3) {
                        console.log('============================================================================================');
                        console.log(`The ${homeTeam} vs. ${awayTeam} GAME IS LIVE!`)
                        console.log('============================================================================================');
                        return runUpdate = true
                    } else {
                        inProgressCounter = 0
                        return runUpdate = false
                    }
                })
                if (runUpdate === true) {
                    new NBA().getGames()
                        .then(data => {
                            console.log(data)
                            let date1 = moment(new Date())
                            new NBA().updateGames(date1)
                        })
                        .then(data => {
                            console.log("YAY!!!")
                            let update = false;
                            function test() {
                                let updateCounter =0
                                updateCounter++;
                                data.map(el => {
                                    console.log(updateCounter)
                                    let status1 = el.Status
                                    if (status1 == 'InProgress' & updateCounter < 25) {
                                        new NBA().getGamesDb().then(data => {
                                            data.map(el => {
                                                let time = el.new_record_number
                                                let currentTime = Date.now()
                                                if ((currentTime) - (time) >= 0) {
                                                    return update = true
                                                } else {
                                                    return update = false
                                                }
                                            })
                                        })
                                    }
                                    if (status1 === "Final") {
                                        return update = false
                                    }
                                })
                            }
                            test()
                            if (update === true) {
                                console.log('============================================================================================');
                                console.log(`UPDATING SCORES!`)
                                console.log('============================================================================================');
                                let newDate = moment(new Date())
                                new NBA().updateGames(newDate);
                                return
                            } else {
                                return console.log('UPDATING GAMES EVERY 5 MINUTES')
                            }
                        })
                }
            }).catch(e => {
                console.log(e)
                return
            })
    }





}

module.exports = NBA




