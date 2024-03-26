const fs = require('fs');

// Path to the JSON file
// change to /../../ for windows testing.
const bansFilePath = __dirname+'/../../storage/misc/blockedInfo.json';

function isBlocked(clientIPv4, req, res) {
    var blockList = fs.readFileSync(bansFilePath);
    blockList = JSON.parse(blockList);

    var banObject = blockList.bans.ip[clientIPv4];

    if(!banObject) {
        if(req.url.endsWith('.php') || req.url.includes("wp-includes")) {
            banObject = {
                "utcTimeBanned": (Date.now()/1000).toFixed(0),
                "reasonBanned": "Seemingly trying to find a .php file or wordpress crap. Pretty sketch, don't do it.",
                "lengthBanned": 2592000,
                "logHistoryAfterBan": `${new Date().toUTCString()} | Blocked connection ${clientIPv4} | at resource ${req.path} | UA ${req.headers['user-agent']}\n`
            };

            blockList.bans.ip[clientIPv4] = banObject;

            fs.writeFileSync(bansFilePath, JSON.stringify(blockList, null, 2));

            res.send(`You have been **IP BANNED** for 30 days with the reason \"${banObject.reasonBanned}\". If this has happened by accident contact \"wackymoder\" on Discord OR wackymoder@feds.contact`);
            res.status(200);
            return true;
        }
    } else {
        banObject.logHistoryAfterBan += `${Date.now()} | Blocked connection ${clientIPv4} | at resource ${req.path} | UA ${req.headers['user-agent']}\n`
        fs.writeFileSync(bansFilePath, JSON.stringify(blockList, null, 2));

        res.send(`You are currently **IP BANNED** for ${((banObject.utcTimeBanned - Date.now()/1000 + banObject.lengthBanned) / 86400).toFixed(0)} days with the reason \"${banObject.reasonBanned}\". If this has happened by accident contact \"wackymoder\" on Discord OR wackymoder@feds.contact`);
        res.status(200);
        return true;
    }

    return false;
}


/*
    "ipBanSchema": {
        "utcTimeBanned": 232323,
        "reasonBanned": "",
        "lengthBanned": "",
        "logHistory": ""
    }
*/
module.exports = {
    isBlocked
}