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
  affichage(api)
  totalCommande(api)
  modifier(api)
  supprimer(api)
  verificationFormulaire()
}

function affichage(api) {
  let div = document.getElementById('cart__items')
  let j = 0
  while (j < panier.length) {
    let article = document.createElement('article')
    article.classList.add("cart__item")
    article.setAttribute("data-id", panier[j].id)
    article.setAttribute("data-color", panier[j].couleur)
    article.innerHTML = "<div class='cart__item__img'><img src=" + api[j].imageUrl + " alt='Photographie d'un canapé'></div><div class='cart__item__content'><div class='cart__item__content__description'><h2> " + api[j].name + " </h2><p>" + panier[j].couleur + "</p><p>" + api[j].price + " €</p></div><div class='cart__item__content__settings'><div class='cart__item__content__settings__quantity'><p>Qté : </p><input type='number' class='itemQuantity' name='itemQuantity' min='1' max='100' value='" + panier[j].quantite + "'></div><div class='cart__item__content__settings__delete'><p class='deleteItem'>Supprimer</p></div></div></div>"
    div.appendChild(article)
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
  let buton = Array.from(document.querySelectorAll("input.itemQuantity"))
  buton.forEach(element => element.addEventListener("change", function (event) {
    let indexNodeList = buton.indexOf(event.currentTarget)
    panier[indexNodeList].quantite = parseInt(event.currentTarget.value)
    localStorage.setItem('panier', JSON.stringify(panier))
    totalCommande(api)
  }))
}

function supprimer(api) {
  let article = Array.from(document.querySelectorAll(".cart__item"))
  let buton = Array.from(document.querySelectorAll("p.deleteItem"))
  buton.forEach(element => element.addEventListener("click", function (event) {
    console.log(buton)
    let indexNodeList = buton.indexOf(event.currentTarget)
    console.log(indexNodeList)
    console.log(article)
    //let couleur = panier[indexNodeList].couleur
    //console.log(couleur)
    //let id = panier[indexNodeList].id
    //panier = panier.filter(element => element.couleur !== couleur || element.id !== id)
    api.splice(indexNodeList, 1)
    panier.splice(indexNodeList, 1)
    article[indexNodeList].remove()
    article.splice(indexNodeList, 1)
    buton.splice(indexNodeList, 1)
    localStorage.setItem('panier', JSON.stringify(panier))
    console.log('article : ' + article)
    console.log(article)
    console.log('panier : ' + panier)
    console.log('api : ' + api)
    totalCommande(api)
  }))
}
function verificationFormulaire() {
  let firstName = document.getElementById('firstName')
  let lastName = document.getElementById('lastName')
  let adress = document.getElementById('address')
  let city = document.getElementById('city')
  let email = document.getElementById('email')
  let tableauFormulaire = new Array()
  tableauFormulaire.push(firstName, lastName, adress, city, email)
  let regexPrenom = /[0-9]/
  let products = new Array()
  document.getElementById('order').addEventListener("click", function (event) {
    event.preventDefault()
    contact = {
      "firstName": firstName.value,
      "lastName": lastName.value,
      "address": adress.value,
      "city": city.value,
      "email": email.value
    }
    JSON.parse(localStorage.getItem('panier')).forEach(element => products.push(element.id))
    console.log(contact)
    console.log(products)
    console.log(tableauFormulaire)
    let i = 0
    while (i < Object.keys(contact).length) {
      if (Object.values(contact)[i].length === 0) {
        document.getElementById(Object.keys(contact)[i] + 'ErrorMsg').textContent = 'Veuillez remplir cette case'
      }
      i++
    }
    envoieFormulaireServeur(contact, products)
    tableauFormulaire.forEach(element => element.addEventListener('change', function (event) {
      console.log(event.currentTarget.value.length)
      if (event.currentTarget === firstName || event.currentTarget === lastName || event.currentTarget === city) {
        if (!!element.value.match(regexPrenom)) {
          document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = 'veuillez ne pas inscrire de chiffre'
        }
        else {
          document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = ''
        }
      } if (event.currentTarget.value.length > 0)
        document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = ''
    }))
  })
}

function envoieFormulaireServeur(contact, products) {
  Object.keys(contact).map(element => {
    if (document.getElementById(element).value.length >= 1) {
      fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        body: JSON.stringify({ contact, products }),
         headers: { "Content-Type": "application/json" },
      })
        .then((response => {
          if (response.status == 201) {
            return response.json();
          }
        })).then((response) => {
          document.location.href = "confirmation.html?orderId="+response.orderId;
      })
      .catch((erreur) => console.log("erreur : " + erreur));
    }
  })
}