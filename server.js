'use strict'
require('locus')
const express       = require('express');
const app           = express();
const generateUrlId = require('./lib/generate-id');
const bodyParser    = require('body-parser');
const Poll          = require('./lib/poll');
const socketIo      = require('socket.io')
const http          = require('http');
const port          = process.env.PORT || 3000;

module.exports = app;

const server = http.createServer(app)

server.listen(port, () => {
    console.log('Listening on port ' + port + '.')
});

const io = socketIo(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');

app.locals.title = 'Real-Poll';
app.locals.poll  = {};


app.get('/', (req, res) => {
    res.render('index');
});

app.get(`/:id/results`, (req, res) => {
    let id = req.params.id
    let currentPollTopic = app.locals.poll[id]
    let pollQuestion     = currentPollTopic.pollQuestion
    let currentPollInfo  = currentPollTopic.options

    res.render('results', { pollQuestion: pollQuestion, currentPollInfo: currentPollInfo });
});

app.get('/:id', (req, res) => {
    let id = req.params.id
    let currentPollInfo = app.locals.poll[id];
    let pollQuestion    = currentPollInfo.pollQuestion
    let pollChoices     = Object.keys(currentPollInfo.options);

    res.render('vote', { id: id, pollQuestion: pollQuestion, choices: pollChoices });
});

app.post('/results', (req, res) => {
    let id = Object.keys(req.body)[0];
    let pollQuestion = app.locals.poll[id].pollQuestion
    let pollOptions  = app.locals.poll[id].options
    let currentPoll  = app.locals.poll[id]

    res.render('successVote', { pollQuestion: pollQuestion, pollOptions: pollOptions });
});

app.post('/polls', (req, res) => {
    let voteUrlId    =  generateUrlId();
    let resultsUrlId =  generateUrlId();
    let voteUrl      = `${req.protocol}://${req.get('host')}/${voteUrlId}`
    let resultsUrl   = `${req.protocol}://${req.get('host')}/${resultsUrlId}/results`
    let pollQuestion = req.body.poll.topic
    let choices      = req.body.poll.choice

    let poll = new Poll(pollQuestion, choices)

    app.locals.poll[resultsUrlId] = poll;
    app.locals.poll[voteUrlId]    = poll;

    res.render('pollGenerate', { voteUrl: voteUrl, resultsUrl: resultsUrl });
});

io.on('connection', (socket) => {
    console.log('A user has connected', io.engine.clientsCount)
})


