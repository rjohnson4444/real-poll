const express = require('express')
const app     = express();

module.exports = app;

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Real-Poll';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

if (!module.parent) {
    app.listen(app.get('port'), () => {
        console.log(`${app.locals.title} is running on ${app.get('port')}.`);
    });
}

