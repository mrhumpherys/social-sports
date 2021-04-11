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
                    document.getElementById('messageAlert').setAttribute("class", "")
                    document.getElementById("blank-field-alert").innerText = "COMMENT DELETED!"
                    setTimeout(function () { document.getElementById('messageAlert').setAttribute("class", "hide") }, 4000)
                    document.location.reload()
                } else {
                    document.getElementById('messageAlert').setAttribute("class", "")
                    document.getElementById("blank-field-alert").innerText = "YOU CAN ONLY DELETE YOUR COMMENTS"
                    setTimeout(function () { document.getElementById('messageAlert').setAttribute("class", "hide") }, 4000)
                    return
                }
            })
        } else {
            document.getElementById('messageAlert').setAttribute("class", "")
            document.getElementById("blank-field-alert").innerText = "YOU CAN ONLY DELETE YOUR COMMENTS"
            setTimeout(function () { document.getElementById('messageAlert').setAttribute("class", "hide") }, 4000)
            return
        }
    })
    return
}



const cbox = document.querySelectorAll('#delete-btn');

for (let i = 0; i < cbox.length; i++) {
    cbox[i].addEventListener("click", commentDelete
    );
}