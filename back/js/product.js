let url = document.location
let urlid = url.search.replace('?id=', '')
//console.log(urlid)
fetch('http://localhost:3000/api/products')
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    data.forEach(id => {
      if (id._id === urlid) {
        let parent = document.getElementById('item__img')

        let image = document.createElement('img')
        image.src = id.imageUrl
        image.alt = id.altTxt
        parent.appendChild(image)

        console.log(id._id)
        document.getElementById('title').innerHTML = id.name
        document.getElementById('price').innerHTML = id.price
        document.getElementById('description').innerHTML = id.description

        let parentcouleur = document.getElementById('colors')
        let i = 0
        while (i < id.colors.length) {
          let couleur = document.createElement('option')
          couleur.value = id.colors[i]
          couleur.innerHTML = id.colors[i]
          console.log(couleur.value)
          parentcouleur.appendChild(couleur)
          i++
        }
      };
    })
  })
    .catch(function (err) {
      console.log(err)
      // Une erreur est survenue
    })