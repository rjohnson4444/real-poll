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

    if(!currentPollTopic) { res.sendStatus(400); }

    let pollQuestion     = currentPollTopic.pollQuestion
    let currentPollInfo  = currentPollTopic.options

    res.render('results', { pollQuestion: pollQuestion, currentPollInfo: currentPollInfo });
});

app.get('/:id', (req, res) => {
    let id = req.params.id
    let currentPollInfo = app.locals.poll[id];

    if(!currentPollInfo) { res.sendStatus(400); }
    if(!currentPollInfo.active) { return res.render('closed') }

    let pollQuestion    = currentPollInfo.pollQuestion
    let pollChoices     = Object.keys(currentPollInfo.options);

    res.render('vote', { id: id, pollQuestion: pollQuestion, choices: pollChoices });
});

app.post('/results', (req, res) => {
    let id = Object.keys(req.body)[0];
    let currentPoll  = app.locals.poll[id]

    if(!currentPoll) { return res.sendStatus(400); }

    let pollQuestion = currentPoll.pollQuestion
    let pollOptions  = currentPoll.options
    let currentVoteOption = req.body[id]

    res.render('successVote', { pollQuestion: pollQuestion, pollOptions: pollOptions, vote: currentVoteOption });
});

app.post('/polls', (req, res) => {
    if(!req.body.poll) { return res.sendStatus(400); }

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


// Sockets

io.on('connection', (socket) => {
    console.log('A user has connected', io.engine.clientsCount);
    io.sockets.emit('userConnected', io.engine.clientsCount);

    socket.on('message', (channel, message) => {
        if (channel === 'currentPoll') {
            let currentVoteCount = recordVote(message);
            io.emit('renderVoteCountForAdmin', currentVoteCount);
        }

        if (channel === 'closePoll') {
            closePoll(message);
        }

    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected', io.engine.clientsCount);
    })
})

function recordVote(vote) {
    let poll = app.locals.poll[vote.pollId]
    poll.options[vote.vote]++
    return poll.options;
}

function closePoll(response) {
    let poll = app.locals.poll[response.id]
    poll.active = false;
}

module.export = app;
