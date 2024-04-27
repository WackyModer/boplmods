const fs = require('fs');

function rebootServer(req,res) {
    
    const clientIPv4 = req.headers['cf-connecting-ip'];

    console.log(JSON.parse(fs.readFileSync(__dirname+"/../../storage/sensitive/config.json")).adminPsw + " real psw");
    console.log(req.headers['authshit'] + " auth");

    if(req.headers['authshit'] == JSON.parse(fs.readFileSync(__dirname+"/../../storage/sensitive/config.json")).adminPsw) {
        require('child_process').exec('sudo /sbin/reboot now', function (msg) { console.log(msg) });
    } else {
        
        var blockList = fs.readFileSync(__dirname+"/../../storage/misc/blockedInfo.json");
        blockList = JSON.parse(blockList);

        banObject = {
            "utcTimeBanned": (Date.now()/1000).toFixed(0),
            "reasonBanned": "Trying to guess the admin password",
            "lengthBanned": 7776000,
            "logHistoryAfterBan": `${new Date().toUTCString()} | Blocked connection ${clientIPv4} | at resource ${req.path} | UA ${req.headers['user-agent']}\n`
        };

        blockList.bans.ip[clientIPv4] = banObject;

        fs.writeFileSync(__dirname+"/../../storage/misc/blockedInfo.json", JSON.stringify(blockList, null, 2));

        res.send(`You have been **IP BANNED** for 90 days (3 months) with the reason \"${banObject.reasonBanned}\". If this has happened by accident contact \"wackymoder\" on Discord OR wackymoder@feds.contact`);
        res.status(200);
        return;
    }
    res.send(`sick`);
    res.status(200);

    return;
}

function updateMyShit(req,res) {
        
    const clientIPv4 = req.headers['cf-connecting-ip'];

    console.log(JSON.parse(fs.readFileSync(__dirname+"/../../storage/sensitive/config.json")).adminPsw + " real psw");
    console.log(req.headers['authshit'] + " auth");

    if(req.headers['authshit'] == JSON.parse(fs.readFileSync(__dirname+"/../../storage/sensitive/config.json")).adminPsw) {
        require('child_process').exec('~/runall.sh', function (msg) { console.log(msg) });
    } else {
        
        var blockList = fs.readFileSync(__dirname+"/../../storage/misc/blockedInfo.json");
        blockList = JSON.parse(blockList);

        banObject = {
            "utcTimeBanned": (Date.now()/1000).toFixed(0),
            "reasonBanned": "Trying to guess the admin password",
            "lengthBanned": 7776000,
            "logHistoryAfterBan": `${new Date().toUTCString()} | Blocked connection ${clientIPv4} | at resource ${req.path} | UA ${req.headers['user-agent']}\n`
        };

        blockList.bans.ip[clientIPv4] = banObject;

        fs.writeFileSync(__dirname+"/../../storage/misc/blockedInfo.json", JSON.stringify(blockList, null, 2));

        res.send(`You have been **IP BANNED** for 90 days (3 months) with the reason \"${banObject.reasonBanned}\". If this has happened by accident contact \"wackymoder\" on Discord OR wackymoder@feds.contact`);
        res.status(200);
        return;
    }
    res.send(`sick`);
    res.status(200);

    return;
}


module.exports = {
    rebootServer,
    updateMyShit
}