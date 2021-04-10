async function commentDelete(event) {
    event.preventDefault();

    
    let comment_id = document.querySelector('#comment-id').getAttribute('data-comment');
    console.log(comment_id);
    comment_id = comment_id.replace("#",'');
    if (comment_id) {
        const response = await fetch(`/api/comments/${comment_id}`, {
            method: 'DELETE',
            
        });
        if (response.ok) {
            console.log('success');
            document.location.reload();
        } else {
            // IF YOU ADD THE DELETE LOOK AT THE LOGIN AND SIGN UP I ADDED A HIDDEN DIV THAT WILL OUTPUT THE ERROR TEXT, 
            // JUST COPY THE DIV FROM THE HANDLEBARS FILES IT IS LABELED AND AT THE TOP
            // COMMENT THIS IN BELOW AFTER AND IT IS READY TO GO
            // =================================================================
            // document.getElementById('messageAlert').setAttribute("style", "visibility:visible")
            // document.getElementById("blank-field-alert").innerText=response.statusText
            // setTimeout(function(){document.getElementById('messageAlert').setAttribute("style", "visibility:collapse")},4000)
            
            alert(response.statusText);
        }
    }
}


document.querySelector('#delete-btn').addEventListener('click', commentDelete);