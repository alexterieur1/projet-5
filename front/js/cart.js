let panier = JSON.parse(localStorage.getItem('panier'))
let tableauPromesses = new Array()
let api = null

recherchePanierEnLocal()
//recherche les informations des canapés stockés dans le panier en local
function recherchePanierEnLocal() {
  panier.map(element => tableauPromesses.push(fetch('http://localhost:3000/api/products/' + element.id)))
  Promise.all(tableauPromesses).then(element => {
    return Promise.all(element.map(r => r.json()))
  }).then(response => {
    api = response
    main()
  })
}
function main() {
  affichageDuPanierDansLeDom()
  CalculDeLaQuantiteEtDuPrixTotal()
  modificationValeurInputCanape()
  supprimerCanapeDuPanier()
  verificationFormulaire()
}
//affihe en liste, les caanpés présent dans le panier
function affichageDuPanierDansLeDom() {
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
//calcul la quantité de canapés et le prix total du panier
function CalculDeLaQuantiteEtDuPrixTotal() {
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
//modifie la quantite d'un canapé dans le panier
function modificationValeurInputCanape() {
  let buton = Array.from(document.querySelectorAll("input.itemQuantity"))
  buton.forEach(element => element.addEventListener("change", function (event) {
    let indexNodeList = buton.indexOf(event.currentTarget)
    panier[indexNodeList].quantite = parseInt(event.currentTarget.value)
    localStorage.setItem('panier', JSON.stringify(panier))
    CalculDeLaQuantiteEtDuPrixTotal()
  }))
}
//supprimer le canapé du panier et de la page
function supprimerCanapeDuPanier() {
  let article = Array.from(document.querySelectorAll(".cart__item"))
  let buton = Array.from(document.querySelectorAll("p.deleteItem"))
  buton.forEach(element => element.addEventListener("click", function (event) {
    let indexNodeList = buton.indexOf(event.currentTarget)
    api.splice(indexNodeList, 1)
    panier.splice(indexNodeList, 1)
    article[indexNodeList].remove()
    article.splice(indexNodeList, 1)
    buton.splice(indexNodeList, 1)
    localStorage.setItem('panier', JSON.stringify(panier))
    CalculDeLaQuantiteEtDuPrixTotal()
  }))
}
//recupere les informations du formulaire et du panier
function verificationFormulaire() {
  let firstName = document.getElementById('firstName')
  let lastName = document.getElementById('lastName')
  let adress = document.getElementById('address')
  let city = document.getElementById('city')
  let email = document.getElementById('email')
  let tableauFormulaire = new Array()
  tableauFormulaire.push(firstName, lastName, adress, city, email)
  let regexChiffre = /^[a-zA-Z éèïî-]+$/
  let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  testRegex(tableauFormulaire, regexChiffre, regexEmail)
  document.getElementById('order').addEventListener("click", function (event) {
    event.preventDefault()
    contact = {
      "firstName": firstName.value,
      "lastName": lastName.value,
      "address": adress.value,
      "city": city.value,
      "email": email.value
    }
    let products = new Array()
    JSON.parse(localStorage.getItem('panier')).forEach(element => products.push(element.id))
    let i = 0
    while (i < Object.keys(contact).length) {
      if (Object.values(contact)[i].length === 0) {
        document.getElementById(Object.keys(contact)[i] + 'ErrorMsg').textContent = 'Veuillez remplir ce champs'
      }
      i++
    }
    if(regexChiffre.test(firstName.value) == true && regexChiffre.test(lastName.value) == true && regexChiffre.test(city.value) == true && regexEmail.test(email.value) == true){
      envoieFormulaireServeur(contact, products)
    }
  })
}
//envoie le formulaire au serveur
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
        })).then((response) => {//dirige vers la page confirmation pour signalé au client que l'achat a été effectué
          document.location.href = "confirmation.html?orderId="+response.orderId;
          localStorage.removeItem('panier')
      })
      .catch((erreur) => console.log("erreur : " + erreur));
    }
  })
}
//verifie le bon formats des inputs du formulaire
function testRegex(tableauFormulaire, regexChiffre, regexEmail){
  tableauFormulaire.forEach(element => element.addEventListener('change', function (event) {
      if(true){
        document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = ''
      }
      if ((event.currentTarget === firstName || event.currentTarget === lastName || event.currentTarget === city) && !regexChiffre.test(element.value)) {
        document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = 'Veuillez ne pas inscrire de chiffre'
      }
      if (event.currentTarget === email && !regexEmail.test(element.value)) {
        document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = 'veuillez écrire une adresse mail valide'
      }
      if (event.currentTarget.value.length < 1){
        document.getElementById(event.currentTarget.id + 'ErrorMsg').textContent = ''
      }
    }
    
  ))
}