async function upvoteHandler(event) {
    event.preventDefault();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    // id = id.replace("#",'');
    const response = await fetch('/api/games/upvote', {
        method: 'PUT',
        body: JSON.stringify({

            games_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(function (err) {
        console.log(err);
        return new Response(JSON.strigify({
            code: 400,
            message: 'You can only vote once!'
        }))
        //err.json();
    });

    if (response.ok) {

        document.location.reload();
    } else {

        // CAN NOT USE WINDOW ALERTS HOWARD HAS SAID A BUNCH OF TIMES HOW MUCH HE HATES THEM
        document.getElementById('messageAlert').classList.remove("hide")
        setTimeout(function(){document.getElementById('messageAlert').classList.add("hide")},4000)
    }
}


document.querySelector('#upvote-btn').addEventListener('click', upvoteHandler);



