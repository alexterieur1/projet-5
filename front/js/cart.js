let panier = JSON.parse(localStorage.getItem('panier'))
let tableauPromesses = new Array()
let i = 0

recherchePanier()
function recherchePanier() {
  while (i < panier.length) {
    tableauPromesses.push(fetch('http://localhost:3000/api/products/' + panier[i].id))
    i++
  }
  Promise.all(tableauPromesses).then(element => {
    return Promise.all(element.map(r => r.json()))
  }).then(api => {
    main(api)

  })
}

function main(api) {
  affichage(api,panier)
  totalCommande(api)
  modifier(api)
  supprimer(api)
}

function affichage(api,panier) {
  let div = document.createElement('div')
  let j = 0
  console.log(panier)
  console.log(panier.length)
  while (j < panier.length) {
    let article = document.createElement('article')
    article.classList.add("cart__item")
    article.setAttribute("data-id", "{" + panier[j].id + "}")
    article.setAttribute("data-color", "{" + panier[j].couleur + "}")
    article.innerHTML = "<div class='cart__item__img'><img src=" + api[j].imageUrl + " alt='Photographie d'un canapé'></div><div class='cart__item__content'><div class='cart__item__content__description'><h2> " + api[j].name + " </h2><p>" + panier[j].couleur + "</p><p>" + api[j].price + " €</p></div><div class='cart__item__content__settings'><div class='cart__item__content__settings__quantity'><p>Qté : </p><input type='number' class='itemQuantity' name='itemQuantity' min='1' max='100' value='" + panier[j].quantite + "'></div><div class='cart__item__content__settings__delete'><p class='deleteItem'>Supprimer</p></div></div></div>"
    document.getElementById('cart__items').appendChild(div)
    div.appendChild(article)
    document.getElementById('cart__items').replaceChild(article, div)
    j++
  }

}

function totalCommande(api) {
  let j = 0
  let prixTotal = 0
  let quantiteTotal = 0
  while (j < panier.length) {
    let prix = api[j].price
    let quantite = panier[j].quantite
    prixTotal += prix * quantite
    quantiteTotal += quantite
    j++
  }

  document.getElementById('totalQuantity').innerHTML = quantiteTotal
  document.getElementById('totalPrice').innerHTML = prixTotal
}

function modifier(api) {
  let article = document.querySelectorAll("input.itemQuantity")
  let tableau = Array.from(article)
  article.forEach(element => element.addEventListener("click", function () {
    let indexNodeList = tableau.indexOf(element)
    let couleur = panier[indexNodeList].couleur
    let id = panier[indexNodeList].id
    let panierFiltre = panier.filter(element => element.couleur == couleur && element.id == id)
    Object.defineProperty(panierFiltre[0], 'quantite', {
      value: parseInt(element.value)
    })
    localStorage.setItem('panier', JSON.stringify(panier))
    totalCommande(api)
  }))
}

function supprimer(api) {
  let article = document.querySelectorAll("p.deleteItem")
  let tableau = Array.from(article)
  article.forEach(element => element.addEventListener("click", function () {
    let indexNodeList = tableau.indexOf(element)
    let couleur = panier[indexNodeList].couleur
    let id = panier[indexNodeList].id
    let panierFiltre = panier.filter(element => element.couleur !== couleur || element.id !== id)
    console.log(panierFiltre)
    //localStorage.setItem('panier', JSON.stringify(panierFiltre))
    console.log(localStorage.getItem('panier'))
    effacer(indexNodeList,api,panier)
  }))
}

function effacer(index,api, panier){
  let article = document.querySelectorAll("article.cart__item")
  let tableau = Array.from(article)
  article.forEach(element => element.addEventListener("click", function () {
    console.log(element)
  affichage(api,panier)
}))
}