const express = require('express');
const port = 3000;
const app = express();
var wiki = require('./server/wiki.js');


// Wiki section
app.get('/wiki', wiki.mainPage);
app.get('/wiki/:page', wiki.returnPage);
app.get('/wikiData', wiki.mainPageRaw);
app.get('/wikiData/:page', wiki.returnPageRaw);
app.post('/wikiData/createPage/:pageName', wiki.createPage)

app.use(function(req, res, next) {
    res.status(404);
    
    if(req.url.toLowerCase().startsWith('/wiki/')) {    
        res.send(`
        <div style="
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        ">
        <h2 style="
        text-align: center;">
        Uh oh! Seems like you got lost
        </h2> <br>
        <h3>Click <a onclick="window.history.go(-1); return false">here</a> to go back</h3>
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
