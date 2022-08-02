fetch('http://localhost:3000/api/products')
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    let i = 0;
    let parent = document.getElementById("items");
    while (i < data.length) {
      let id = document.createElement("a");
      id.href = "./product.html?id=" + data[i]._id;
      parent.appendChild(id);
      let parentCarte = id.appendChild(document.createElement("article"));

      let image = document.createElement('img');
      image.src = data[i].imageUrl;
      image.alt = data[i].altTxt;
      parentCarte.appendChild(image);

      let nom = document.createElement('h3');
      nom.innerText = data[i].name;
      parentCarte.appendChild(nom);

      let description = document.createElement('p');
      description.innerText = data[i].description;
      parentCarte.appendChild(description);

      i++;
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
  });
