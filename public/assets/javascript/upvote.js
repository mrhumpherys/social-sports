async function upvoteHandler(event) {
    event.preventDefault();

    let id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    id = id.replace("#",'');
    const response = await fetch('/api/games/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            games_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}


document.querySelector('#upvote-btn').addEventListener('click', upvoteHandler);