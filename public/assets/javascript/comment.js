//all id's or classes need to reflect page and script added to 

async function submitComment(event) {
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

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

document.querySelector('whateverTheDeleteButtonIs').addEventListener('click', commentDelete);
document.querySelector('.whateverTheCommentbuttonIs').addEventListener('submit', submitComment);