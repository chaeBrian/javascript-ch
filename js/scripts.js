let tbody = document.querySelector('.tbody');
let shopCart = [];
//Evento click sobre el Add to Cart.
const buttonClick = document.querySelectorAll('.button');
buttonClick.forEach(btn => { btn.addEventListener('click', addToCartItem)});
function addToCartItem(e){
    //Notificacion generada al agregar un producto al carrito.
    Toastify({
        text: "Jersey added to Bag",
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
//Subida de elementos al carrtio mediante DOM.
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
                <button class="delete btn btn-danger"><i class="bi bi-backspace"></i></button>
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
    itemCartTotal.innerHTML = `$${total}`;
    addlocalStorage()
}
//Eliminar productos del carrito de compras.
function removeItemShopCart(e){
    Toastify({
        text: "Jersey removed from Bag",
        offset: {
          x: 10,
          y: -3 
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
//Countdown Timer
// establezco la fecha en la que estamos contando hacia atrás
let countDownDate = new Date("Aug 5, 2022 16:00:00").getTime();
// actualizo la cuenta regresiva cada 1 segundo
let x = setInterval(function() {
  // obtengo la fecha y hora de hoy
  let now = new Date().getTime();
  // encuentro la distancia entre ahora y la fecha de la cuenta regresiva
  let distance = countDownDate - now;
  // cálculos de tiempo para días, horas, minutos y segundos.
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // muestra el resultado en un elemento con id="timer"
  document.getElementById("timer").innerHTML =`
    <a class="border border-warning text-warning p-2 fw-bold fs-5 text-decoration-none" 
        href="https://www.premierleague.com/news/2646764">
        Fixtures Here
    </a>
    <span class="fs-2 fw-bolder text-warning">Premier League 2022-23 season starts in</span>
    <div class="d-flex flex-row border border-light m-2">
        <p class="m-1"><span class="fs-6 fw-bold text-light">${days}</span><br>DAYS</p>
        <p class="m-1"><span class="fs-6 fw-bold text-light">${hours}</span><br>HRS</p>
        <p class="m-1"><span class="fs-6 fw-bold text-light">${minutes}</span><br>MIM</p>
        <p class="m-1"><span class="fs-6 fw-bold text-light">${seconds}</span><br>SEC</p>
    </div>
    `
  // aviso para cuando termina la cuenta regresiva
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "Premier League 22/23 is underway";
  }
}, 1000);
//Api local
const premierLeagueNews = async () => {
    let responseNews = await fetch("./premier-league-news.json")
    let dataNews = await responseNews.json()
    for (const premierNews of dataNews){
        let newsContainer = document.createElement('div');
        newsContainer.classList.add('newsPremierLeague');
        newsContainer.innerHTML = `
            <a target="_blank" href="${premierNews.newsLink}" class="d-flex flex-row m-2" style="border: 1px solid rgba(0, 0, 0, 0.211);">
                <img class="w-25" src="${premierNews.newsImg}">
                <div class="d-flex flex-column p-2">
                    <p class="" style="font-size: smaller; font-weight: bold; color: #6b0d76; font-style: italic;">${premierNews.newsCatg}</p>
                    <p class="ms-3" style="color: #3b0541;">${premierNews.newsTittle}</p>
                </div>
            </a>
        `
        document.getElementById("premierLeagueNewsId").append(newsContainer)
    }
}
const premierLeagueClubs = async () => {
    let responseClubs = await fetch("./premier-league-clubs.json")
    let dataClubs = await responseClubs.json()
    console.log(responseClubs)
    console.log(dataClubs);
    for (const premierClubs of dataClubs){
        let clubsContainer = document.createElement("li");
        clubsContainer.classList.add('nav-item');
        clubsContainer.innerHTML = `
            <a target="_blank" class="nav-link nav__clubs" href="${premierClubs.team.clubpage}"><img style="width: 30px" src="${premierClubs.team.logo.href}"></a>
        `
        document.getElementById("premierLeagueClubsId").append(clubsContainer)
    }
}
const premierLeagueAwards = async () => {
    let responseAwards = await fetch("./premier-league-awards.json")
    let dataAwards = await responseAwards.json()
    console.log(responseAwards)
    console.log(dataAwards);
    for (const premierAwards of dataAwards){
        let awardsContainer = document.createElement("div");
        awardsContainer.classList.add('mt-1');
        awardsContainer.classList.add('col-6');
        awardsContainer.classList.add('p-0');
        awardsContainer.innerHTML = `
        <div class="card border-0" style="width: 13rem; color: #3b0541;
            background: url(../img/background-premier-cup.png);
            background-size: cover";
            background-position: center;>
            <img src="${premierAwards.plimg}" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="m-0 fs-6">${premierAwards.plaward}</p>
                <h5 class="card-title mb-1 fs-6">${premierAwards.plname}</h5>
                <p class="card-text">${premierAwards.plstat1}</p>
                <p class="card-text">${premierAwards.plstat2}</p>
                <p class="card-text">${premierAwards.plstat3}</p>
            </div>
        </div>
        `
        document.getElementById("premierLeagueCards").append(awardsContainer);
    }
}
premierLeagueAwards()
premierLeagueClubs()
premierLeagueNews()
//API Premier League (Table)
let matches = document.getElementById("matches");
let urlApi = "https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=2021&sort=asc";
fetch(urlApi)
.then(res => res.json())
.then((json) => {
    for (const club of json.data.standings){
        let trApi = document.createElement("tr");
        trApi.innerHTML = `
            <td class="premierPosition">${club.stats[8].displayValue}</td>
            <td class="premierClub d-flex flex-row"><img class="img-fluid" src="${club.team.logos[0].href}" alt=""><span>${club.team.shortDisplayName}</span></td>
            <td class="premierStats">${club.stats[3].displayValue}</td>
            <td class="premierStats">${club.stats[0].displayValue}</td>
            <td class="premierStats">${club.stats[2].displayValue}</td>
            <td class="premierStats">${club.stats[1].displayValue}</td>
            <td class="premierStats">${club.stats[4].displayValue}</td>
            <td class="premierStats">${club.stats[5].displayValue}</td>
            <td class="premierStats">${club.stats[9].displayValue}</td>
            <td class="premierStats--modifier">${club.stats[6].displayValue}</td>
        `
        document.getElementById("matches").append(trApi);
    }
});