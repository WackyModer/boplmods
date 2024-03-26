const express = require('express');
const port = 3000;
const app = express();

var wiki = require('./server/wiki.js');
var blocking = require('./server/blocking.js');

var fs = require('fs');
var path = require('path');
var os = require('os');

// setup stuff

/*if(!fs.existsSync()) {
    fs.writeFileSync(__dirname+"../../storage/misc/blockedInfo.json", JSON.stringify(
    {  
        "bans": {
            "emails": {},
            "ip": {}
        },
        "ipBanSchema": {
            "utcTimeBanned": 232323,
            "reasonBanned": "",
            "lengthBanned": "",
            "logHistory": ""
        }
    }));
}*/
filePath = __dirname+"/../../storage/misc/blockedInfo.json"

const directoryPath = path.dirname(filePath);

fs.access(directoryPath, fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Directory ${directoryPath} created`);
  }

  fs.writeFile(filePath, JSON.stringify(
    {  
        "bans": {
            "emails": {},
            "ip": {}
        },
        "ipBanSchema": {
            "utcTimeBanned": 232323,
            "reasonBanned": "",
            "lengthBanned": "",
            "logHistory": ""
        }
    }), (err) => {
    if (err) throw err;
    console.log(`File ${filePath} created`);
  });
});


app.use((req,res, next) => {
    const clientIPv4 = req.headers['cf-connecting-ip'];
    const clientIPv4_3 = req.headers['x-forwarded-for'];

    var curDate = new Date();

    if(blocking.isBlocked(clientIPv4, req, res)) {
        // If they're blocked, just return
        console.log(`${curDate.toUTCString()} | Blocked connection ${clientIPv4} | at resource ${req.path} | UA ${req.headers['user-agent']}`)
        return;
    }

    console.log(`${curDate.toUTCString()} | New connection, ${clientIPv4} | ${clientIPv4_3} | at resource ${req.path} | UA ${req.headers['user-agent']}`);
    
    res.send("<h2 style=\"font-family: arial;\">You aren't meant to be here yet D:</h2>")
    res.status(200);
    return;
})

// Static pages stuff, because I do NOT wanna be stuck with routing forever
app.use(express.static('./storage/public'));


// Wiki section
app.get('/wiki/:page', wiki.returnPage);
app.get('/wikiData/:page', wiki.returnPageRaw);
app.post('/wikiData/createPage/:pageName', wiki.createPage);

app.get('/server/uptime', (req, res) => {
    res.send(`Server has been up for ${process.uptime().toFixed(0)} seconds, so it is ${(21600-process.uptime()).toFixed(0)} seconds from updating (Updates every 6 hours)
    <br><br>
    Current usages are: ${(100-os.freemem()/os.totalmem()*100).toFixed(1)}% (${((os.totalmem()-os.freemem())/1024/1024/1024).toFixed(1)} GB) mem usage (theres not that much mem)`)
    res.status(200);
});

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
/*
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
        //output = execSync('cp ../storage/* /mountedStorage/backupStorageLoc/', { encoding: 'utf-8' }); // put your copy command here

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

*/