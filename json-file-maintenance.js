
const fs = require('fs');
const moment = require('moment');

 function deleteFiles() {
// directory path
const dir = './data/';

// list all files in the directory
fs.readdir(dir, (err, files) => {
    if (err) {
        console.log(err);
    }
    // rips the day-date out of the file name
    files.forEach(file => {
        let date = (moment(new Date()).format("YYYY-MM-DD"));
        currentDay=date.split("-")[2];
        data = file.split("-")[3];
        day=data.split('.')[0]

        // checks to see if the #of days that have past is greater than or equal to 2, if it is, delete those files.
        if(currentDay-day >= 2){
            console.log('=========================================================')
            console.log(`File: ${file} needs to be deleted!`)
            console.log('=========================================================')
            // DELETES FILE
        try {
            fs.unlinkSync(`${dir}${file}`);

            console.log(`File: ${file} successfully deleted!`);
        } catch (error) {
            console.log(error);
        }
        }else{
            console.log('=========================================================')
            console.log(`File: ${file} doesn't need to be deleted!`)
            console.log('=========================================================')
            return
        }
        
    });
});
}


module.exports= deleteFiles
