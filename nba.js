require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');
const { Games } = require('./models');
const path = require('path');
const e = require('express');

class NBA {
    constructor() {
        this.data = [];
    }

    async getGames() {
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
                            console.log(`Error writing file: ${err}`);
                        } else {
                            console.log(`Game File is written successfully!`);
                        }
                    });
                });
        return response
    }

    async getNews() {
        let response = await
            fetch(`https://fly.sportsdata.io/v3/nba/scores/json/News`, {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.KEY
                }
            })
                .then(res => res.json())
        return response
    }

    async getGamesDb(date) {
        // let date = (moment(new Date()).format("YYYY-MM-DD"));
        let response = await JSON.parse(fs.readFileSync(`./data/games-${date}.json`, 'utf8',));
        return response;
    };


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
                    day: el.Day,
                    day_time: el.DayTime,
                    updated: el.Updated,
                    quarter: el.Quarter,
                    time_remaining_minutes: el.TimeRemainingMinutes,
                    time_remaining_seconds: el.TimeRemainingSeconds,
                    home_team_score: el.HomeTeamScore,
                    away_team_score: el.AwayTeamScore,
                    status: el.Status,
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
            if (e.errno == -4058) {
                console.log("FILE NOT FOUND CREATING GAMES!");
                // IF FILE NOT FOUND ERROR, GET GAMES- GET GAMES WILL FETCH THE API AND WRITE THE JSON TO A FILE IN THE DATA FOLDER
                try {
                    let response = await new NBA().getGames()
                    return response
                }
                catch (e) {
                    console.log("This broke while attempting to run the get games inside the create game function inside the catch error", e)
                }
                finally {
                    // IF THE GET GAMES COMES BACK WITH OUT ERROR, RUN CREATE GAMES AGAIN TO LOAD THE DB 
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    new NBA().createGames(date1)
                }

            } else {
                // AN ERROR NOT RELATED TO NOT FINDING THE FILE
                console.log("THIS BROKE WHILE CREATING GAMES IN createGames() ", e)
            }
        }
    }


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

    async updateGames(date) {

        try {
            let response = JSON.parse(fs.readFileSync(`./data/games-${date}.json`, 'utf8',));
            let games = (response)
            // console.log(games)

            let data = await games.map(el => {
                return {
                    game_id: el.GameID,
                    game_type: "basketball",
                    day: el.Day,
                    day_time: el.DayTime,
                    updated: el.Updated,
                    quarter: el.Quarter,
                    time_remaining_minutes: el.TimeRemainingMinutes,
                    time_remaining_seconds: el.TimeRemainingSeconds,
                    home_team: el.HomeTeam,
                    home_team_id: el.HomeTeamID,
                    home_team_score: el.HomeTeamScore,
                    away_team: el.AwayTeam,
                    away_team_id: el.AwayTeamID,
                    away_team_score: el.AwayTeamScore,
                    status: el.Status,
                    channel: el.Channel,
                    quarters: el.Quarters,
                }
            })
            console.log(data)
            // CREATE THE RECORDS IN BULK, DB WONT ALLOW DUPLICATES BUT CATCH THE ERROR
            data.forEach(el => {
                Games.update(el, {where: {id: el.game_id}}).then(updateGameData => {
                    if (!updateGameData) {
                       console.log(updateGameData)
                    } else {
                      console.log("SUCCESS")
                    }

                }).catch(e => {
                    console.log(e)
                    return;
                });
            })


        } catch (e) {
            if (e.errno == -4058) {
                console.log("FILE NOT FOUND CREATING GAMES!");
                // IF FILE NOT FOUND ERROR, GET GAMES- GET GAMES WILL FETCH THE API AND WRITE THE JSON TO A FILE IN THE DATA FOLDER
                try {
                    let response = await new NBA().getGames()
                    return response
                }
                catch (e) {
                    console.log("This broke while attempting to run the get games inside the create game function inside the catch error", e)
                }
                finally {
                    // IF THE GET GAMES COMES BACK WITH OUT ERROR, RUN CREATE GAMES AGAIN TO LOAD THE DB 
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    new NBA().updateGames(date1)
                }

            } else {
                // AN ERROR NOT RELATED TO NOT FINDING THE FILE
                console.log("THIS BROKE WHILE CREATING GAMES IN createGames() ", e)
            }
        }
    }

    updateStats() {
        let timer
        function startTimer() {
             timer = setInterval(function () {
                new NBA().getGames();
                new NBA().updateGames();


                console.log("Refreshing Scores");
                
            }, 5000);
        }

        function stopTimer() {
            console.log("Timer stopped");
           
            clearInterval(timer);

        }

        // startTimer();
        // stopTimer();
    }



}


//Games.bulkCreate(data)
// new NBA().createGames();
module.exports = NBA


// const {teamData} = require('../../seeds/team-seeds')
// // console.log(teamData)
// let urlLogo=[];
// teamData.map(data =>{
//      urlLogo.push(data.WikipediaLogoUrl)
// })
// console.log(urlLogo)