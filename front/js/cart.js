fetch('http://localhost:3000/api/products')
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    let i = 0
    let parent = document.getElementById('cart__items')
    while(i < localStorage.length){
        let id = localStorage.getItem(localStorage.key(i)).split(',')[0]
        let couleur = localStorage.getItem(localStorage.key(i)).split(',')[1]
        let quantite = localStorage.getItem(localStorage.key(i)).split(',')[2]
        
        let article = document.createElement('article')
        article.className = 'cart__item'
        parent.appendChild(article)

        let divimage = document.createElement('div')
        divimage.className = 'cart__item__img'
        let image = document.createElement('img')
        article.appendChild(divimage)

        /* image.src = data[i].imageUrl
        image.alt = data[i].altTxt
        divimage.appendChild(image) */

        let divproduit = document.createElement('div')
        divproduit.className = "cart__item__content"
        article.appendChild(divproduit)

        let divdescription = document.createElement('div')
        divdescription.className = 'cart__item__content__description'
        divproduit.innerHTML = '<h2>Nom du produit</h2><p>' + couleur + '</p><p>42,00 €</p>'
        divproduit.appendChild(divdescription)

        let divquantite = document.createElement('div')
        divquantite.className = 'cart__item__content__settings'
        divquantite.innerHTML = "<div class='cart__item__content__settings__quantity'><p>Qté : </p><input type='number' class='itemQuantity' name='itemQuantity' min='1' max='100' value=" + quantite + "></div><div class='cart__item__content__settings__delete'><p class='deleteItem'>Supprimer</p></div></div>"
        divproduit.appendChild(divquantite)
        i++
    }
  })