
// uhhhhh
// we need a better thing than this
const fs = require('fs');

function doesFileExist(path) {
    try {
        fs.accessSync(path);
        return true;
    } catch (err) {
        return false;
    }
}

function returnPage(req, res) {
    const data = fs.readFileSync('accounts.json');
    var accounts = JSON.parse(data);

    if(accounts[req.params.userId]) {
        res.send(accounts[req.params.userId]);
    } else {
        res.send({
            "error": "Page does not exist",
            "errorId": 4041,
        })
        res.status(404);
    }
}

function createPage(req, res) {
    if 
}

module.exports = {
  mainPage,
  returnPage,
  createPage
}