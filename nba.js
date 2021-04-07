require('dotenv').config();
fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');
;
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
                    const data = JSON.stringify(json);
                    fs.writeFile(`./games-${date}.json`, data, 'utf8', (err) => {
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
        let response = await JSON.parse(fs.readFileSync(`./games-${date}.json`, 'utf8',));
        console.log(response)
    }

}



//Games.bulkCreate(data)
new NBA().createGames();
;
module.exports = NBA


// const {teamData} = require('../../seeds/team-seeds')
// // console.log(teamData)
// let urlLogo=[];
// teamData.map(data =>{
//      urlLogo.push(data.WikipediaLogoUrl)
// })
// console.log(urlLogo)