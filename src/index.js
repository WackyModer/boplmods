const express = require('express');
const port = 3000;
const app = express();
var wiki = require('./server/wiki.js');
var os = require('os');

app.use((req,res) => {
    const clientIPv4 = req.headers['cf-connecting-ip'];
    const clientIPv6 = req.headers['​​cf-connecting-ipv6']; // May be undefined
    const clientIPv4_2 = req.headers['cf-pseudo-ipv4']; // May be undefined
    const clientIPv4_3 = req.headers['x-forwarded-for'];

    console.log(`New connection, ${clientIPv4} | ${clientIPv4_2} | ${clientIPv4_3} | ${clientIPv6} | at resource ${req.path}`);
    res.send("leave.");
    res.status(200);//406)
    return;
})

// Static pages stuff, because I do NOT wanna be stuck with routing forever
app.use(express.static('./storage/public'));


// Wiki section
app.get('/wiki/:page', wiki.returnPage);
app.get('/wikiData/:page', wiki.returnPageRaw);
app.post('/wikiData/createPage/:pageName', wiki.createPage);

app.get('/server/uptime', (req, res) => {
    res.send(`Server has been up for ${process.uptime().toFixed(0)} seconds, so it is ${(43200-process.uptime()).toFixed(0)} seconds from updating (Updates every 12 hours)
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