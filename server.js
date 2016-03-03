const express    = require('express')
const app        = express();
const generateUrlId = require('./lib/generate-id');
const bodyParser = require('body-parser');
const voteUrlId    =  generateUrlId();
const resultsUrlId =  generateUrlId();


module.exports = app;

app.set('port', process.env.PORT || 3000);
app.use(express.static('static'));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');

app.locals.title = 'Real-Poll';
app.locals.pollTopic = {}

app.get('/', (req, res) => {
    res.render('index');
});

app.get(`/${resultsUrlId}/results`, (req, res) => {
    var id = resultsUrlId;
    var currentPollTopic = app.locals.pollTopic[id]

    res.render('results', { pollQuestion: currentPollTopic });
});

app.get(`/${voteUrlId}`, (req, res) => {
    var id = resultsUrlId;
    var currentPollTopic = app.locals.pollTopic[id]

    res.render('vote', { pollQuestion: currentPollTopic });
});

app.post('/results', (req, res) => {
    var id = resultsUrlId;
    var currentPollTopic = app.locals.pollTopic[id]

    // value that is returned from the radio button
    console.log(req.body.vote)
    res.render('vote', { pollQuestion: currentPollTopic });
});

app.post('/polls', (req, res) => {
    var id = resultsUrlId;
    app.locals.pollTopic[id] = req.body.pollTopic
    // Initiate the 'polling' room

    res.redirect('polls');
});

app.get('/polls', (req, res) => {
    var voteUrl    = `${req.protocol}://${req.get('host')}/${voteUrlId}`
    var resultsUrl = `${req.protocol}://${req.get('host')}/${resultsUrlId}/results`

    res.render('pollGenerate', { voteUrl: voteUrl, resultsUrl: resultsUrl });
});

if (!module.parent) {
    app.listen(app.get('port'), () => {
        console.log(`${app.locals.title} is running on ${app.get('port')}.`);
    });
}

