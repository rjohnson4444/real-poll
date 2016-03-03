const express    = require('express')
const app        = express();
const generateUrlId = require('./lib/generate-id');
const voteUrlId    =  generateUrlId();
const resultsUrlId =  generateUrlId();


module.exports = app;

app.set('port', process.env.PORT || 3000);
app.use(express.static('static'));
app.set('view engine', 'jade');

app.locals.title = 'Real-Poll';
app.locals.pollParticipants = {}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/polls', (req, res) => {
    var voteUrl    = `https://real-polls/${voteUrlId}`
    var resultsUrl = `https://real-polls/${resultsUrlId}/results`

    res.render('pollGenerate', { voteUrl: voteUrl, resultsUrl: resultsUrl });
});

if (!module.parent) {
    app.listen(app.get('port'), () => {
        console.log(`${app.locals.title} is running on ${app.get('port')}.`);
    });
}

