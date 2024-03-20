const express = require('express');
const port = 3000;
const app = express();
var wiki = require('./server/wiki.js');


app.get('/wiki', wiki.mainPage);
app.get('/wiki/:page', wiki.returnPage);
app.post('/wiki/createPage/:pageName', wiki.createPage)

app.listen(port, () => {
    console.log(`Express server has started on port ${port}`)
});
