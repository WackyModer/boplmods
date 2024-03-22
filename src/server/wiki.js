
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
    console.log("page");
}

function createPage(req, res) {
    if(doesFileExist()) {
        res.send({
            "error": "Could not create page as it exists",
            "errorID": 1005
        })
        res.status(416);
    }
    req.params.pageName
}

function mainPage(req, res) {
    
}

function mainPageRaw() {

}

function returnPageRaw() {

}

module.exports = {
  returnPage,
  createPage,
  returnPageRaw
}