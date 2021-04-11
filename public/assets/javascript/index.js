
// $(document).on('ready', function() {

//     $(".single-item").slick({
//       infinite: false,
//       autoplay: true, 
//       autoplaySpeed: 10000,
//     });
//   });

// let readMore = `<a href="{{Url}}"target="_blank" rel="noreopener">Read More <i class="fas fa-arrow-right"></i></a>`;
// let previewText = document.querySelectorAll('.news-article p');
// for (var i = 0; i < previewText.length; i++) {
//     let previewTextContent = previewText[i].innerText;
//     // console.log(previewTextContent);
//     let updatedpreviewTextContent = previewTextContent.slice(0, 140);
//     //previewText = updatedpreviewTextContent;
//     console.log(updatedpreviewTextContent);
//     //previewText[i] = updatedpreviewTextContent;
// }

let gameCardHeight = document.querySelectorAll('.game-card')[0].offsetHeight;
let newsCardEl = document.querySelector('.news-container');
// let heightCheck = function () {
//     newsCardEl.style.height(gameCardHeight);
// }
// heightCheck();
// console.log(gameCardHeight);

// $(function() {
//     $(newsCardEl).css("height", gameCardHeight);
//   });


//   window.onresize = function() {
//     $(newsCardEl).css("height", gameCardHeight);
//   }
