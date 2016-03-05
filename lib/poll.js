require('locus')

function Poll (pollQuestion, options){
    this.pollQuestion = pollQuestion
    this.options = formatPollChoices(options)|| {}
}

function formatPollChoices (choices) {
    var options = {}
    for (var i = 0; i < choices.length; i++) {
        options[choices[i]] = 0;
    }
    return options
}

module.exports = Poll;
