const express = require('express');
const port = 3000;
const app = express();

var wiki = require('./server/wiki.js');
var blocking = require('./server/blocking.js');
var api = require('./server/api.js');

var fs = require('fs');
var path = require('path');
var os = require('os');


console.log(path.resolve(__dirname + "/../storage/misc/blockedInfo.json"));

// should work :pray: :pray: :pray:
fs.access(path.resolve(__dirname + "/../storage/misc/blockedInfo.json"), fs.constants.F_OK, (err) => {
    if (err) {
        fs.writeFile(path.resolve(__dirname + "/../storage/misc/blockedInfo.json"), JSON.stringify({
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
            }, null, 2),
            (err) => {
                if (err) {
                    console.error("Error creating file:", err);
                } else {
                    console.log("File created successfully");
                }
            }
        );
    } else {
        console.log("File already exists");
    }
});


async function configCheck() {
    while (true) {
        var config = JSON.parse(fs.readFileSync(path.resolve(__dirname+"/../storage/sensitive/config.json")));
        if(!config.isSetup) {
            console.log("Config.json not set up!")
            await fuckingSleepPls(3000); // Polls every 5 seconds for it
        } else {
            break;
        }
    }
}

// grr config needs to be setup
configCheck().then(() => {

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
    
    next();

    //res.send("<h2 style=\"font-family: arial;\">You aren't meant to be here yet D:</h2>")
    //res.status(200);
    //return;
})

// Static pages stuff, because I do NOT wanna be stuck with routing forever
app.use(express.static(path.resolve(__dirname + '/../storage/public')));


// Wiki section
app.get('/wikiData/:page', wiki.returnPageRaw);
app.post('/wikiData/:pageName', wiki.createPage);
app.put('/wikiData/:pageName', wiki.updatePage);


// api section

app.get('/api/rebootYourselfNow', api.rebootServer);
app.get('/api/updateShit', api.updateMyShit);
//app.get('/api/ughStupidDosShit', api.turnOffTunnelTwoHours)


// make /discord bring you to discord :blehhhhhh:

app.get('/discord*', (req, res) => {
    res.redirect(308, 'https://discord.gg/official-bopl-battle-modding-comunity-1175164882388275310');
    return;
})


// Server stuff
/*
app.get('/server/uptime', (req, res) => {
    req.headers['']
    res.send(`Server has been up for ${process.uptime().toFixed(0)} seconds, so it is ${(21600-process.uptime()).toFixed(0)} seconds from updating (Updates every 6 hours)
    <br><br>
    Current usages are: ${(100-os.freemem()/os.totalmem()*100).toFixed(1)}% (${((os.totalmem()-os.freemem())/1024/1024/1024).toFixed(1)} GB) mem usage (theres not that much mem)`)
    res.status(200);
}); */

// Server stuff
app.get('/server/uptime', (req, res) => {
    const uptimeSeconds = process.uptime().toFixed(0);
    const timeUntilUpdate = (21600 - uptimeSeconds).toFixed(0);
    const memUsagePercent = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1);
    const memUsageGB = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(1);

    console.log("Uptime:" + uptimeSeconds + "\n" + "Time until update:" + timeUntilUpdate + "\n" + "Memory Usage percent:" + memUsagePercent + "\n" + "Memory in use:" + memUsageGB)

    res.render('../storage/specialPages/uptime', {
        uptime: uptimeSeconds,
        timeUntilUpdate: timeUntilUpdate,
        memUsagePercent: memUsagePercent,
        memUsageGB: memUsageGB
    });
});

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('you got a little bit silly (AAAAAAAAAAAAAAAAAAAA SOMETHING BROKEEEEEEEEEEE DM MEEEE)');
})

app.use(function(req, res, next) {
    
    if(req.url.toLowerCase().startsWith('/wiki/')) {    
        res.sendFile(path.resolve(__dirname+"/../storage/specialPages/404Wiki.html"));
        res.status(404);
        return;
    }

    if(req.url.toLowerCase().startsWith('/mods/')) {
        res.sendFile(path.resolve(__dirname+"/../storage/specialPages/404Mod.html"));
        res.status(404);
        return;
    }

    // respond with html page
    if (req.accepts('html')) {
        res.sendFile(path.resolve(__dirname+"/../storage/specialPages/404.html"));
        res.status(404);
        return;
    }
  
    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        res.status(404);
        return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
    res.status(404);
});

app.listen(port, () => {
    console.log(`Express server has started on port ${port}`)
});


});

function fuckingSleepPls(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
/*
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

