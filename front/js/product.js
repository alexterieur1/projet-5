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
      let parent = document.querySelector('.item__img')

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
        //verifie si la quntité a été selectionner
        function verificationQuantite(nombre) {
          if (quantiteChoisi >= 1 && quantiteChoisi <= 100) {
            article.quantite = quantiteChoisi
            return nombre
          } else {
            bouton.innerHTML = 'Veuillez sélectionner un nombre valide entre 1 et 100'
            return false
          }
        }
        //verifie si la couleur a été selectionner
        function verificationCouleur(couleur) {
          if (!!couleur) {
            article.couleur = couleur
            return couleurChoisi
          } else {
            bouton.innerHTML = 'Veuillez sélectionner une couleur'
            return false
          }
        }
        //verifie que les informations ont bien été sélectionner pour constituer le panier
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
        //aiguille le code si le canapé de la page est dans le panier ou non
        function condition(couleur, id) {
          panierVide()
          let tableaufiltre = tableau.filter(element => element.couleur == couleur && element.id == id)
          if (tableaufiltre.length == 0) {
            enregistrementCanapeAbsence()
          } else {
            enregistrementCanapeExistance(tableaufiltre)
          }
        }
        //ajoute les informations du canapéx pour le mettre dans le panier
        function enregistrementCanapeAbsence() {
          tableau.push(article)
          localStorage.setItem('panier', JSON.stringify(tableau))
          bouton.innerHTML = "Ajouté !"
        }
        //enregistre la nouvelle quantite d'un canapé si celui ci est deja dans le panier
        function enregistrementCanapeExistance(tableaufiltre) {
          article.quantite = quantiteChoisi + tableaufiltre[0].quantite
          Object.defineProperty(tableaufiltre[0], 'quantite', {
            value: article.quantite
          })
          localStorage.setItem('panier', JSON.stringify(tableau))
        }
        //créer un panier si le panier est vide
        function panierVide() {
          if (!!localStorage.getItem('panier')) {
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