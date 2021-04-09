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
            console.log('success');
            alert(comment_text);
            //document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}
async function commentDelete(event) {
    event.preventDefault();
    const comment_id = document.querySelector('commentId').value;
    if (comment_id) {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('success');
        //    document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

let hasComment = document.querySelector('#delete-btn');
if(hasComment) {
    document.querySelector('#delete-btn').addEventListener('click', commentDelete);
}

document.querySelector('#add-comment-btn').addEventListener('click', submitComment);