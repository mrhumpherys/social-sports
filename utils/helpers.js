module.exports = {
    format_date: (date) => {
        let newDate = date.split('T')[0];

        return newDate;

    },
    nice_format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
           date 
        ).getFullYear()}`;
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${word}s`;
        }

        return word;
    },
    // format_time: (date) => {
    //     let newDate = date.split('T')[1];
    //     let time = newDate.split(":")[0];
    //     let mins = newDate.split(":")[1];
        
    //     if (time > 12) {
    //         let formatted_time = time -= 12
    //         let newTime = formatted_time + ":" + mins
    //         return newTime;
    //     } else {
    //         let formatted_time = time.split("0");
    //         let newTime = formatted_time + ":" + mins;
    //         return newTime
    //     }
    // },
    format_time: gameTime => {
        const moment = require ("moment")
        let newDate = moment(gameTime).tz("America/New_York").format("hh:mm")
        return(newDate)
    },
    format_min: (time) => {
        if (time === null) {
            return time = "00"
        } 
        if (time <10) {
            return '0'+time;
        } else {
            return time;
        }
    },
    format_quarter: (time, start) => {
        if (time == null) {
            return start
        } else {
            return 'Q ' + time;
        }
    },

    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${word}s`;
        }

        return word;
    },
    deleteButton: (poster, user, options) => {
        
        // user = id
        // poster = user.id
        // console.log(poster);
        // console.log(user);
        console.log(poster, user);
        if (poster === user) {
            return options.fn(this);
        } else {
            return;
        }
    },



    render_team_logo: (id, logo) => {

        if (id === 1) {
            logo = "https://upload.wikimedia.org/wikipedia/en/0/02/Washington_Wizards_logo.svg"
            return logo;
        }
        if (id === 2) {
            logo = "https://upload.wikimedia.org/wikipedia/en/c/c4/Charlotte_Hornets_%282014%29.svg"
            return logo;
        }
        if (id === 3) {
            logo = "https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg"
            return logo;
        }
        if (id === 4) {
            logo = "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg"
            return logo;
        }
        if (id === 5) {
            logo = "https://upload.wikimedia.org/wikipedia/en/1/10/Orlando_Magic_logo.svg"
            return logo;
        }
        if (id === 6) {
            logo = "https://upload.wikimedia.org/wikipedia/en/2/25/New_York_Knicks_logo.svg"
            return logo;
        }
        if (id === 7) {
            logo = "https://upload.wikimedia.org/wikipedia/en/0/0e/Philadelphia_76ers_logo.svg"
            return logo;
        }
        if (id === 8) {
            logo = "https://upload.wikimedia.org/wikipedia/commons/4/44/Brooklyn_Nets_newlogo.svg"
            return logo;
        }
        if (id === 9) {
            logo = "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg"
            return logo;
        }
        if (id === 10) {
            logo = "https://upload.wikimedia.org/wikipedia/en/3/36/Toronto_Raptors_logo.svg"
            return logo;
        }
        if (id === 11) {
            logo = "https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg"
            return logo;
        }
        if (id === 12) {
            logo = "https://upload.wikimedia.org/wikipedia/en/4/4b/Cleveland_Cavaliers_logo.svg"
            return logo;
        }
        if (id === 13) {
            logo = "https://upload.wikimedia.org/wikipedia/en/1/1b/Indiana_Pacers.svg"
            return logo;
        }
        if (id === 14) {
            logo = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Pistons_logo17.svg"
            return logo;
        }
        if (id === 15) {
            logo = "https://upload.wikimedia.org/wikipedia/en/4/4a/Milwaukee_Bucks_logo.svg"
            return logo;
        }
        if (id === 16) {
            logo = "https://upload.wikimedia.org/wikipedia/en/c/c2/Minnesota_Timberwolves_logo.svg"
            return logo;
        }
        if (id === 17) {
            logo = "https://upload.wikimedia.org/wikipedia/en/0/04/Utah_Jazz_logo_%282016%29.svg"
            return logo;
        }
        if (id === 18) {
            logo = "https://upload.wikimedia.org/wikipedia/en/5/5d/Oklahoma_City_Thunder.svg"
            return logo;
        }
        if (id === 19) {
            logo = "https://upload.wikimedia.org/wikipedia/en/2/21/Portland_Trail_Blazers_logo.svg"
            return logo;
        }
        if (id === 20) {
            logo = "https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg"
            return logo;
        }
        if (id === 21) {
            logo = "https://upload.wikimedia.org/wikipedia/en/f/f1/Memphis_Grizzlies.svg"
            return logo;
        }
        if (id === 22) {
            logo = "https://upload.wikimedia.org/wikipedia/en/2/28/Houston_Rockets.svg"
            return logo;
        }
        if (id === 23) {
            logo = "https://upload.wikimedia.org/wikipedia/en/0/0d/New_Orleans_Pelicans_logo.svg"
            return logo;
        }
        if (id === 24) {
            logo = "https://upload.wikimedia.org/wikipedia/en/a/a2/San_Antonio_Spurs.svg"
            return logo;
        }
        if (id === 25) {
            logo = "https://upload.wikimedia.org/wikipedia/en/9/97/Dallas_Mavericks_logo.svg"
            return logo;
        }
        if (id === 26) {
            logo = "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg"
            return logo;
        }
        if (id === 27) {
            logo = "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg"
            return logo;
        }
        if (id === 28) {
            logo = "https://upload.wikimedia.org/wikipedia/en/b/bb/Los_Angeles_Clippers_%282015%29.svg"
            return logo;
        }
        if (id === 29) {
            logo = "https://upload.wikimedia.org/wikipedia/en/d/dc/Phoenix_Suns_logo.svg"
            return logo;
        }
        if (id === 30) {
            logo = "https://upload.wikimedia.org/wikipedia/en/c/c7/SacramentoKings.svg"
            return logo;
        }

    },
    render_team_name: (id, name) => {

        if (id === 1) {
            name = "Wizards"
            return name;
        }
        if (id === 2) {
            name = "Hornets"
            return name;
        }
        if (id === 3) {
            name = "Hawks"
            return name;
        }
        if (id === 4) {
            name = "Heat"
            return name;
        }
        if (id === 5) {
            name = "Magic"
            return name;
        }
        if (id === 6) {
            name = "Knicks"
            return name;
        }
        if (id === 7) {
            name = "76ers"
            return name;
        }
        if (id === 8) {
            name = "Nets"
            return name;
        }
        if (id === 9) {
            name = "Celtics"
            return name;
        }
        if (id === 10) {
            name = "Raptors"
            return name;
        }
        if (id === 11) {
            name = "Bulls"
            return name;
        }
        if (id === 12) {
            name = "Cavaliers"
            return name;
        }
        if (id === 13) {
            name = "Pacers"
            return name;
        }
        if (id === 14) {
            name = "Pistons"
            return name;
        }
        if (id === 15) {
            name = "Bucks"
            return name;
        }
        if (id === 16) {
            name = "Timberwolves"
            return name;
        }
        if (id === 17) {
            name = "Jazz"
            return name;
        }
        if (id === 18) {
            name = "Thunder"
            return name;
        }
        if (id === 19) {
            name = "Trail Blazers"
            return name;
        }
        if (id === 20) {
            name = "Nuggets"
            return name;
        }
        if (id === 21) {
            name = "Grizzlies"
            return name;
        }
        if (id === 22) {
            name = "Rockets"
            return name;
        }
        if (id === 23) {
            name = "Pelicans"
            return name;
        }
        if (id === 24) {
            name = "Spurs"
            return name;
        }
        if (id === 25) {
            name = "Mavericks"
            return name;
        }
        if (id === 26) {
            name = "Warriors"
            return name;
        }
        if (id === 27) {
            name = "Lakers"
            return name;
        }
        if (id === 28) {
            name = "Clippers"
            return name;
        }
        if (id === 29) {
            name = "Suns"
            return name;
        }
        if (id === 30) {
            name = "Kings"
            return name;
        }
    },



}
