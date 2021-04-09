async function submitComment(event) {
    event.preventDefault();
    const comment_text = document.querySelector('#comment-textarea').value.trim();
    const games_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
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
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}
document.querySelector('#delete-btn').addEventListener('click', commentDelete);
document.querySelector('#add-comment-btn').addEventListener('submit', submitComment);