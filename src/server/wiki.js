
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

function updatePage(req, res) {

}

function returnPageRaw() {
    // uhhh so all this has got to do is check if
    // a .raw file exists in
}

module.exports = {
  createPage,
  returnPageRaw,
  updatePage
}