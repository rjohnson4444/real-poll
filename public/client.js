var socket = io();

$(document).ready(() => {
    $('.add-input').on('click', (e) => {
        $('.choices').append("<br><br><input type='text' name='poll[choice][]' placeholder='Choice' class='form-control' ></input>")
    });
});


