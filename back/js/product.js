let url = document.location
let urlid = url.search.replace('?id=','')
console.log(urlid)
fetch('http://localhost:3000/api/products')
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (data) {
    console.log(data.indexOf(urlid))
    if (data[0]._id === urlid){
      console.log('yes!')
      console.log(data)
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
  });
