async function submitComment(event) {
    event.preventDefault();
    const comment_text = document.querySelector('#comment-textarea').value.trim();
    let games_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    games_id = games_id.replace("?",'');
    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                comment_text,
                games_id
            }),
            headers: {
                "Content-Type": 'application/json'
            }
        });
        if (response.ok) {
            
            
            document.location.reload();
        } else {
            document.getElementById('messageAlert').setAttribute("style", "visibility:visible")
            document.getElementById("blank-field-alert").innerText=response.statusText
            setTimeout(function(){document.getElementById('messageAlert').setAttribute("style", "visibility:collapse")},4000)
            
        }
    }
}



document.querySelector('#add-comment-btn').addEventListener('click', submitComment);
