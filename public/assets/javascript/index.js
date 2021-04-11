
// $(document).on('ready', function() {

//     $(".single-item").slick({
//       infinite: false,
//       autoplay: true, 
//       autoplaySpeed: 10000,
//     });
//   });

let readMore = `<a href="{{Url}}"target="_blank" rel="noreopener">Read More <i class="fas fa-arrow-right"></i></a>`;
let previewText = document.querySelectorAll('.news-article p');
for (var i = 0; i < previewText.length; i++) {
    let previewTextContent = previewText[i].innerText;
    // console.log(previewTextContent);
    let updatedpreviewTextContent = previewTextContent.slice(0, 140);
    //previewText = updatedpreviewTextContent;
    console.log(updatedpreviewTextContent);
    //previewText[i] = updatedpreviewTextContent;
}

