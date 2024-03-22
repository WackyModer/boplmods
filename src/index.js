const express = require('express');
const port = 3000;
const app = express();
var wiki = require('./server/wiki.js');

// Static pages stuff, because I do NOT wanna be stuck with routing forever
app.use(express.static('./storage/public'));


// Wiki section
app.get('/wiki/:page', wiki.returnPage);
app.get('/wikiData/:page', wiki.returnPageRaw);
app.post('/wikiData/createPage/:pageName', wiki.createPage)

app.use(function(req, res, next) {
    res.status(404);
    
    if(req.url.toLowerCase().startsWith('/wiki/')) {    
        res.send(`
        <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        ">
        <div style="
        text-align: center;
        ">
        <h2>
        Uh oh! Seems like you got lost
        </h2>
        <h3>Click <i><b><a style="cursor: pointer;" onclick="window.history.go(-1); return false">here</a></b></i> to go back or <i><b><a style="cursor: pointer;" onclick="window.location.href = "/wiki"; return false;">here</a></b></i> to got to the main page</h3>
        </div<
        </div>
        
        `).end();
        return;
    }

    // respond with html page
    if (req.accepts('html')) {
        res.send("<h1>h</h1>").end();
        return;
    }
  
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
});
app.listen(port, () => {
    console.log(`Express server has started on port ${port}`)
});

function fuckingSleepPls(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function backupLoop() {
    // start backup process
    var backupCount = 0
    console.log("Entered backup log")
    while (true) {
        console.log("loop");
        console.log("Starting to write backup");
        var datetime = new Date();
        //console.log(datetime);
        var backupFolderName = "backup_"+
        datetime.getFullYear()+"-"+
        datetime.getMonth()+"-"+
        datetime.getDate()+"_"+
        datetime.getHours()+"-"+
        datetime.getMinutes()+"-"+
        datetime.getSeconds();

        console.log("Preparing to write to folder" + backupFolderName);

        const execSync = require('child_process').execSync;
        // import { execSync } from 'child_process';  // replace ^ if using ES modules
        var output;
        // windows
        output = execSync(`xcopy .\\storage\\ .\\backupStorageLoc\\${backupFolderName} /E/H/C/I`, { encoding: 'utf-8' }); // put your copy command here
        // linux
        // Preferably ../mountedStorage would be where you mount your drive.
        //output = execSync('cp ../storage/* ../mountedStorage/backupStorageLoc/', { encoding: 'utf-8' }); // put your copy command here

        backupCount++;

        if(backupCount >= 11) {
            output = execSync('ls', { encoding: 'utf-8' }); // delete furthest back copy
            backupCount--;

            console.log("Deleted old backup")
        }
        
        console.log("Finished Backup!")
        //const output = execSync('ls', { encoding: 'utf-8' }); 
        //console.log('Output was:\n', output);
        await fuckingSleepPls(86400000);
    }
}

//console.log("Entering backup loop");
//backupLoop();