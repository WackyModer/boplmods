const express = require('express');
const port = 3000;
const app = express();
var wiki = require('./server/wiki.js');


// Wiki section
app.get('/wiki', wiki.wikiLoader);
app.get('/wiki/:page', wiki.wikiLoaderPage);
app.get('/wikiData', wiki.mainPage);
app.get('/wikiData/:page', wiki.returnPage);
app.post('/wikiData/createPage/:pageName', wiki.createPage)

app.listen(port, () => {
    console.log(`Express server has started on port ${port}`)
});
