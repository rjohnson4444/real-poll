'use strict';

const socket = io();

let $newChoice = $('.add-input');
let $buttons = $('.well#vote button');
let $renderVotes = $('#render-votes');
let $adminView = $('#admin-view');
let $closePoll = $('#close-poll');
let $closePollMessage = $('#close-poll-message');
let pollId = window.location.pathname.split("/")[1];
let alreadyVoted = false;

// Add new choice
$newChoice.on('click', (e) => {
    $('.choices').append("<br><br><input type='text' name='poll[choice][]' placeholder='Choice' class='form-control' ></input>");
});


// Close poll
$closePoll.on('click', (e) => {
    socket.send('closePoll', { id: pollId, closeMessage: $closePollMessage })
    $closePollMessage.append("<h4>You have closed this poll.");
})

socket.on('userConnected', (count) => {
    console.log(count);
})

for( let i = 0; i < $buttons.length; i++ ) {
    $buttons[i].addEventListener('click', (e) => {
        socket.send('currentPoll', { pollId: pollId, vote: e.target.value });
    });
}

socket.on('renderVoteCountForAdmin', (message) => {
    $adminView.empty();

    for(let vote in message) {
        let currentVote = `<li>${vote}: has ${message[vote]} votes</li>`
        $adminView.append(currentVote);
    }
})


