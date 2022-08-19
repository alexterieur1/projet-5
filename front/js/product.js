let parametre = (new URL(document.location)).searchParams
let url = parametre.get('id')
fetch('http://localhost:3000/api/products/' + url)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    if (data._id === url) {
      let parent = document.getElementById('item__img')

      let image = document.createElement('img')
      image.src = data.imageUrl
      image.alt = data.altTxt
      parent.appendChild(image)

      document.getElementById('title').innerHTML = data.name
      document.getElementById('price').innerHTML = data.price
      document.getElementById('description').innerHTML = data.description

      let parentcouleur = document.getElementById('colors')
      let i = 0
      while (i < data.colors.length) {
        let couleur = document.createElement('option')
        couleur.value = data.colors[i]
        couleur.innerHTML = data.colors[i]
        parentcouleur.appendChild(couleur)
        i++
      }
      let bouton = document.getElementById('addToCart')
      bouton.addEventListener('click', function () {
        let quantiteChoisi = parseInt(document.getElementById('quantity').value)
        let couleurChoisi = document.getElementById('colors').value
        let article = {
          id: url
        }
        let tableau = new Array()

        verification()

        function verificationQuantite(nombre) {
          console.log(nombre)
          if (quantiteChoisi >= 1 && quantiteChoisi <= 100) {
            article.quantite = quantiteChoisi
            return nombre
          } else {
            bouton.innerHTML = 'Veuillez sélectionner un nombre valide entre 1 et 100'
            return false
          }
        }

        function verificationCouleur(couleur) {
          console.log(couleur)
          if (!!couleur) {
            article.couleur = couleur
            return couleurChoisi
          } else {
            bouton.innerHTML = 'Veuillez sélectionner une couleur'
            return false
          }
        }

        function verification() {
          if (verificationCouleur(couleurChoisi) == false && !!verificationQuantite(quantiteChoisi) == false) {
            bouton.innerHTML = 'Veuillez vérifier les données saisies '
          }else {
            if(!!verificationQuantite(quantiteChoisi) == false || !!verificationCouleur(couleurChoisi) == false){
              verificationQuantite(quantiteChoisi)
              verificationCouleur(couleurChoisi)
            }else{
            condition(couleurChoisi, url)
            }
          }
        }

        function condition(couleur, id) {
          panierVide()
          let tableaufiltre = tableau.filter(element => element.couleur == couleur && element.id == id)
          if (tableaufiltre.length == 0) {
            enregistrementCanapeAbsence()
          } else {
            enregistrementCanapeExistance(tableaufiltre)
          }
        }

        function enregistrementCanapeAbsence() {
          tableau.push(article)
          localStorage.setItem('panier', JSON.stringify(tableau))
          bouton.innerHTML = "Ajouté !"
          console.log(localStorage.getItem('panier'))
        }

        function enregistrementCanapeExistance(tableaufiltre) {
          article.quantite = quantiteChoisi + tableaufiltre[0].quantite
          Object.defineProperty(tableaufiltre[0], 'quantite', {
            value: article.quantite
          })
          localStorage.setItem('panier', JSON.stringify(tableau))
        }

        function panierVide() {
          if (!!localStorage.getItem('panier')) {
            console.log(JSON.parse(localStorage.getItem('panier')))
            return tableau = JSON.parse(localStorage.getItem('panier'))
          }
        }
      })
    };
  })
  .catch (function (err) {
  console.log(err)
  // Une erreur est survenue
})