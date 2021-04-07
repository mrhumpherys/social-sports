require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');
const { Games } = require('./models');
const path = require('path');

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



    async createGames(date) {
        let games;
       
        // let date = (moment(new Date()).format("YYYY-MM-DD"));
        try {
            let response = JSON.parse(fs.readFileSync(`./data/games-${date}.json`, 'utf8',));
            games = (response)
            console.log(games)

            // console.log(data)
           let data = await games.map(el => {
                return {
                    game_id: el.GameID
                }
            })

            Games.bulkCreate(data);

        } catch (e) {
            if (e.errno === -4058) {
                console.log("FILE NOT FOUND CREATING GAMES!");

                try{
                   let response = await new NBA().getGames()
                   return response
                }catch (e){
                    console.log("This broke while attempting to run the get games check inside the catch error", e)
                }
                finally{
                    let date1 = (moment(new Date()).format("YYYY-MM-DD"));
                    new NBA().createGames(date1)
                }
                

            } else {
                console.log("THIS BROKE WHILE CREATING GAMES IN createGames() ", e)
            }

        } 




    }

    async needGames() {

        try {
            let date = (moment(new Date()).format("YYYY-MM-DD"));
            let games = await new NBA().getGamesDb(date)
            if (!games) {
                const game = new NBA().getGames();
                return game;
            } else {
                return
            }
        } catch (e) {
            console.log("THIS BROKE WHILE CHECKING FOR THE NEED TO CREATE THE GAME", e)
        }


    }


}
//Games.bulkCreate(data)
new NBA().createGames();
module.exports = NBA


// const {teamData} = require('../../seeds/team-seeds')
// // console.log(teamData)
// let urlLogo=[];
// teamData.map(data =>{
//      urlLogo.push(data.WikipediaLogoUrl)
// })
// console.log(urlLogo)