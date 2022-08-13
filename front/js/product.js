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
        let quantite = parseInt(document.getElementById('quantity').value)
        let couleurChoisi = document.getElementById('colors').value
        let tableau = [url, couleurChoisi, quantite]
        if (quantite >= 1 && quantite <= 100) {/* si le canapé existe dans le panier */
          if (localStorage.getItem(url + couleurChoisi) !== null && couleurChoisi.length > 0) { /* si la couleur est valide */
            quantite += parseInt(localStorage.getItem(url + couleurChoisi).split(',')[2])
            console.log("avant de supprimer" + tableau + '/' + typeof (quantite))
            tableau.pop()
            console.log("apres supprimer" + tableau)
            tableau.push(parseInt(quantite))
            console.log("fini " + tableau)
            localStorage.setItem(url + couleurChoisi, tableau)
            console.log(localStorage)
            bouton.innerHTML = "Ajouté !"
          }
          if (couleurChoisi.length > 0) { /* si la couleur n'existe pas */
            console.log(tableau)
            localStorage.setItem(url + couleurChoisi, tableau)
            console.log(localStorage)
            bouton.innerHTML = "Ajouté !"
          } else { /* la couleur n'est pas valide */
          bouton.innerHTML = "Veuillez sélectionner une couleur"
        }
        }else{
          bouton.innerHTML = "Veuillez sélectionner un nombre valide entre 1 et 100"
        }
      })
    };
  })
  .catch(function (err) {
    console.log(err)
    // Une erreur est survenue
  })



/*   if (quantite >= 1 && quantite <= 100) {      si la quantite est correct a une plage 
  if (couleurChoisi.length > 0) {          si la couleur est valide 
    if (url === localStorage.id) {    verifie si il y a l'id dans le localstorage 
      if (couleurChoisi === localStorage.couleur) {
        let localQuantite = parseInt(localStorage.getItem('quantite'))
        quantite += localQuantite     on incrémente la quantite ajouter au panier 
        localStorage.setItem('quantite', quantite)    on l'ajoute a localStorage 
        localStorage.setItem('id', url)
        localStorage.setItem('couleur', couleurChoisi)
        console.log(tableau)
      } else {
        let quantite = parseInt(localStorage.getItem('quantite'))
        let couleurChoisi = document.getElementById('colors').value
        localStorage.setItem('quantite', quantite)    on l'ajoute a localStorage
        localStorage.setItem('id', url)
        localStorage.setItem('couleur', couleurChoisi)
        tableau.push(localStorage)
        console.log(tableau)
      }
    } else {
      localStorage.setItem('id', url)
      localStorage.setItem('quantite', document.getElementById('quantity').value)
      localStorage.setItem('couleur', document.getElementById('colors').value)
      tableau.push(localStorage)
      console.log(localStorage)
    }
  } */
/*   let tableau = []
  let bouton = document.getElementById('addToCart')
  bouton.addEventListener('click', function () {
    tableau.push('id' , urlid)
    console.log(tableau)
    localStorage.setItem('id', urlid)
    localStorage.setItem('quantite', document.getElementById('quantity').value)
    let id = localStorage.getItem('id')
    let quantite = localStorage.getItem('quantite')
    tableau.push(localStorage)
    console.log(id + ' ' + quantite)
    console.log(tableau)
    bouton.innerHTML = "ajouté !";
  }); */