async function commentDelete(event) {
    event.preventDefault();
    console.log(event.target);
    let comment_id = document.querySelector('#comment-id').getAttribute('data-comment');
    console.log(comment_id);
    comment_id = comment_id.replace("#",'');
    if (comment_id) {
        const response = await fetch(`/api/comments/${comment_id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('success');
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}


document.querySelector('#delete-btn').addEventListener('click', commentDelete);