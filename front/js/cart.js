fetch('http://localhost:3000/api/products')
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    let i = 0
    let j = 0
    let k = 0
    let parent = document.getElementById('cart__items')
    let panier = JSON.parse(localStorage.getItem('panier'))
    console.log(data[0].colors[0])
    let quantiteTotal = 0
    let prixTotal = 0

    affichage()

    function affichage() {
      let j = 0
      while (j < panier.length) {
        if (data[i]._id == panier[j].id) {
          let article = document.createElement('article')
          article.className = 'cart__item'
          parent.appendChild(article)

          let divimage = document.createElement('div')
          divimage.className = 'cart__item__img'
          let image = document.createElement('img')
          article.appendChild(divimage)

          image.src = data[i].imageUrl
          image.alt = data[i].altTxt
          divimage.appendChild(image)
          console.log(i + 'test' + j)

          let divproduit = document.createElement('div')
          divproduit.className = "cart__item__content"
          article.appendChild(divproduit)

          let divdescription = document.createElement('div')
          divdescription.className = 'cart__item__content__description'
          divproduit.appendChild(divdescription)
          
          let descriptionTitre = document.createElement('h2')
          descriptionTitre.innerHTML = data[i].name
          divdescription.appendChild(descriptionTitre)
          
            let descriptionCouleur = document.createElement('p')
            descriptionCouleur.innerHTML = panier[j].couleur
            divdescription.appendChild(descriptionCouleur)
            
          let descriptionNom = document.createElement('p')
          descriptionNom.innerHTML = data[i].price +' €'
          divdescription.appendChild(descriptionNom)

          let divquantite = document.createElement('div')
          divquantite.className = 'cart__item__content__settings'
          divquantite.innerHTML = "<div class='cart__item__content__settings__quantity'><p>Qté : </p><input type='number' class='itemQuantity' name='itemQuantity' min='1' max='100' value=" + panier[j].quantite + "></div><div class='cart__item__content__settings__delete'><p class='deleteItem'>Supprimer</p></div></div>"
          divproduit.appendChild(divquantite)

          totalPanier(i, j)
          j++
        }
        i++
      }
    }

    function totalPanier(i,j){
      quantiteTotal = quantiteTotal + panier[j].quantite
      console.log(prixTotal)
      prixTotal = prixTotal + (data[i].price * panier[j].quantite)
      console.log(prixTotal)

      document.getElementById('totalQuantity').innerHTML = quantiteTotal
      document.getElementById('totalPrice').innerHTML = prixTotal
    }

  })
