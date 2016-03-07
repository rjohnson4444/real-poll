'use strict';

const socket = io();

let $newChoice = $('.add-input');
let $userConnection = $('#connection-count');
let $buttons = $('.well#vote button');
let $generatePollButtion = $('#generate-poll');
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

// Get poll id
$generatePollButtion.on('click', (e) => {
    console.log("clicked button")
    socket.send('userConnected', { pollId: pollId });
});

// Close poll
$closePoll.on('click', (e) => {
    socket.send('closePoll', { id: pollId, closeMessage: $closePollMessage })
    $closePollMessage.append("<h4>You have closed this poll.");
})


socket.on('userConnected', (count) => {
    console.log(count);
    $userConnection.text(`Connected count ${count}`);
})

for( let i = 0; i < $buttons.length; i++ ) {
    $buttons[i].addEventListener('click', (e) => {
        if(alreadyVoted) {
           socket.close();
           return;
        }
        socket.send('setPollId', { pollId: pollId, vote: e.target.value })
        alreadyVoted = true;
    });
}

socket.on('renderVoteCount', (message) => {
    $adminView.empty();

    for(let vote in message) {
        let currentVote = `<li>${vote}: has ${message[vote]} votes</li>`
        $adminView.append(currentVote);
    }
})

