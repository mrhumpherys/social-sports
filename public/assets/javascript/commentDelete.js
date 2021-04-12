async function commentDelete(event) {
    event.preventDefault();

    console.log(event.target)
    let comment_id = event.target.getAttribute("data-comment");
    let user = event.target.getAttribute("data-user");
    console.log(`++++++\nFRONT-END\nthis is the COMMENTId: ${comment_id}`)


    let apiUrl = `https://sports-buzz.herokuapp.com/api/comments/${comment_id}`
    fetch(apiUrl).then(function (response) {
        console.log(response)
        if (response.ok) {


            async function deleteComment() {
                const responseDelete = await fetch(`https://sports-buzz.herokuapp.com/api/comments/${comment_id}`, {
                    method: 'DELETE',
                })
                return responseDelete
            }
            deleteComment().then(res => {
                if (res.ok) {
                    document.getElementById('deleteAlert').classList.remove("hide")
                    document.getElementById("blank-field-alert").innerHTML = 'Successfully deleted your comment';
                    setTimeout(function () { document.getElementById('deleteAlert').classList.add("hide")}, 4000)
                    document.location.reload()
                } else {
                    document.getElementById('deleteAlert').classList.remove("hide")
                    document.getElementById("blank-field-alert").innerText = response.statusText;
                    setTimeout(function () { document.getElementById('deleteAlert').classList.add("hide")}, 4000)
                    return
                }
            })
        } else {
            document.getElementById('deleteAlert').setAttribute("style", "visibility:visible")
            document.getElementById("blank-field-alert").innerText = 'You can only delete your own comments';
            setTimeout(function () { document.getElementById('deleteAlert').classList.add("hide")}, 4000)
            return
        }
    })
    return
}



const cbox = document.querySelectorAll('#delete-btn');

for (let i = 0; i < cbox.length; i++) {
    cbox[i].addEventListener("click", commentDelete);
}