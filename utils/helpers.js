const fs = require('fs');
const moment = require('moment');

let teams = JSON.parse(fs.readFileSync('./data/teams.json'));

module.exports = {
  render_team_url: id => {
    let team = teams.filter(t => t.TeamID == id)[0];
    return team.WikipediaLogoUrl;
  },
  render_team_name: id => {
    let team = teams.filter(t => t.TeamID == id)[0];
    return team.Name.toUpperCase();
  },
  render_date: date_time => {
    return moment(date_time).format('h:mm A').toUpperCase();
  },
  random_number: () => Math.floor(Math.random() * 10),
};
