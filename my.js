require('dotenv').config();
initializeDatabase = ()  =>  {
    console.log('\n Thank you for being lazy!');
    const { spawn } = require('child_process');
    const child = spawn(`mysql -u root -p${process.env.DB_PW}`, { shell: true, detached: true });

    child.stdout.on('data', (data) => {
        console.log(`child stdout:\n${data}`);
    });

    child.stderr.on('data', (data) => {
        //console.error(`child stderr:\n${data}`);
    });
    child.on('exit', function (code, signal) {
        console.log('\n Running Seeds...\n');

    });
    
}

initializeDatabase();

