const express = require('express');
const port = 3000;
const app = express();

var blocking = require('./server/blocking.js');

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
})

app.use(express.static(path.resolve(__dirname + '/../storage/public')));


app.use(function(req, res, next) {
    
    res.send("Theres nothing else here, leave");
    res.status(404);
});

app.listen(port, () => {
    console.log(`Express server has started on port ${port}`)
});