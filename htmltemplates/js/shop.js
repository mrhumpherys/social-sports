var removeCartItemBtns = document.querySelectorAll('.btn-danger')
console.log(removeCartItemBtns);
for (var i = 0; i < removeCartItemBtns.length; i++) {
    var removeBtn = removeCartItemBtns[i]
    removeBtn.addEventListener('click', function (event) {
        event.preventDefault()
        var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal()
    })
}

var quantityInputs = document.querySelectorAll('.item-qty')
for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i]
    input.addEventListener('change', quanityChanged)
}
var addToCartBtns = document.querySelectorAll('.add-to-cart')
for (var i = 0; i < addToCartBtns.length; i++) {
    var button = addToCartBtns[i]
    button.addEventListener('click', addToCartClick)
}

function addToCartClick(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.querySelectorAll('.item-title')[0].innerText
    var price = shopItem.querySelectorAll('.item-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    var itemRow = document.createElement('tr')
    var cartItems = document.querySelectorAll("#cart tbody")[0]
    var cartItemNames = cartItems.querySelectorAll('.item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if(cartItemNames[i].innerText == title) {
            alert('already there')
            return
        }
    }
    var itemRowContents = `
        <tr class="item-row">
            <td class="item-title">${title}</td>
            <td class="item-qty"><input type="number" value="1"></td>
            <td class="item-price">${price}</td>
            <td><button type="button" class="btn btn-danger"><i class="far fa-trash-alt"></i> REMOVE</button></td>
        </tr>
        `
    itemRow.innerHTML = itemRowContents
    cartItems.appendChild(itemRow)
    updateCartTotal()
}

function quanityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function updateCartTotal() {
    var cartItemContainer = document.querySelectorAll('#cart')[0]
    var itemRows = cartItemContainer.querySelectorAll('.item-row')
    var total = 0;
    for (var i = 0; i < itemRows.length; i++) {
        var itemRow = itemRows[i]
        var itemPrice = itemRow.querySelectorAll('.item-price')[0]
        var itemQty = itemRow.querySelectorAll('.item-qty input')[0]
        console.log(itemPrice, itemQty)
        var price = parseFloat(itemPrice.innerText.replace('$', ''))
        var quantity = itemQty.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.querySelectorAll('.cart-total')[0].innerText = '$' + total
    alert('new price ' + total)
}