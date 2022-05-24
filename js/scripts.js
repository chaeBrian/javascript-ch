const buttonClick = document.querySelectorAll('.button');
let tbody = document.querySelector('.tbody');
let shopCart = [];
//Evento click sobre el Add to Cart
buttonClick.forEach(btn => { btn.addEventListener('click', addToCartItem)});
function addToCartItem(e){
    //Notificacion generada al agregar un producto al carrito.
    Toastify({
        text: "Jersey added to Cart",
        offset: {
          x: 10, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: -3 // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        style: {
            background: "linear-gradient(to right, #01ff86, #01ff86)",
            color: "black",
        },
    }).showToast();
    //Informacion sobre el producto que se agregara al carrito a traves de 'newItem'
    const button = e.target;
    const item = button.closest('.card');
    const itemSubtitle = item.querySelector('.card-subtitle').textContent;
    const itemPrice = item.querySelector('.card-title').textContent;
    const itemImg = item.querySelector('.card-img-top').src;
    const newItem = {
        title: itemSubtitle,
        price: itemPrice,
        img: itemImg,
        quantity: 1,
    }
    addItemCart(newItem)
}
function addItemCart(newItem){
    //Suma de cantidades del mismo producto seleccionado.
    const inputE = tbody.getElementsByClassName('quantity--counter');
    for(i = 0; i < shopCart.length; i++){
        if(shopCart[i].title.trim() === newItem.title.trim()){
            shopCart[i].quantity ++;
            const inputValue = inputE[i];
            inputValue.value++;
            shopCartTotal();
            return null;
        }
    }
    shopCart.push(newItem);
    renderCart()
}
//Subida de elementos al DOM.
function renderCart(){
    tbody.innerHTML = '';
    shopCart.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCart');
        const Content =
            `
            <td class="table__jerseys">
                <img src="${item.img}" alt="">
                <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.price}</p></td>
            <td class="table__quantity">
                <input class='quantity--counter' type="number" min="1" value="${item.quantity}">
                <button class="delete btn btn-danger">Delete</button>
            </td>
            `
        tr.innerHTML = Content;
        tbody.append(tr);
        tr.querySelector('.delete').addEventListener('click', removeItemShopCart);
        tr.querySelector('.quantity--counter').addEventListener('change', sumQuantity);
    });
    shopCartTotal();
}
//Suma total de precios.
function shopCartTotal(){
    let total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal');
    shopCart.forEach((item) => {
        const price = Number(item.price.replace("$", ''));
        total = total + price * item.quantity;
    })
    itemCartTotal.innerHTML = `Total: $${total}`;
    addlocalStorage()
}
//Eliminar productos del carrito de compras.
function removeItemShopCart(e){
    Toastify({
        text: "Jersey removed from Cart",
        offset: {
          x: 10, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: -3 // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        style: {
            background: "linear-gradient(to right, #e90053, #e90053)",
        },
    }).showToast();
    const deleteButton = e.target;
    const tr = deleteButton.closest('.itemCart');
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < shopCart.length; i++){
        shopCart[i].title.trim() === title.trim() && shopCart.splice(i, 1);
        /* if(shopCart[i].title.trim() === title.trim()){
            shopCart.splice(i, 1)
        } */
    }
    tr.remove();
    shopCartTotal();
}
//Cambiar valor del input con type = number, y sumar el precio sugun la cantidad selecionada.
function sumQuantity(e){
    const sumInput = e.target;
    const tr = sumInput.closest('.itemCart');
    const title = tr.querySelector('.title').textContent;
    shopCart.forEach(item => {
        if (item.title.trim() === title){
            sumInput.value < 1 ? (sumInput.value = 1) : sumInput.value;
            item.quantity = sumInput.value;
            shopCartTotal();
        }
    })
}
//Guardado en el localstorage del carrito del usuario.
function addlocalStorage(){
    localStorage.setItem('shopCart', JSON.stringify(shopCart))
}
window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('shopCart'));
    if (storage){
        shopCart = storage;
        renderCart();
    }
}
