// Permet d'insérer chaque canapé dans le DOM

function showItems(e) {
  return `
    <a href="./product.html?id=${e._id}">
      <article>
        <img src="${e.imageUrl}" alt="${e.altTxT}">
        <h3 class="productName">${e.name}</h3>
        <p class="productDescription">${e.description}</p>
      </article>
    </a>
  
  `;
}

//Appel API pour récupérer les données liées aux canapés

async function updateItems() {
  await fetch("http://localhost:3000/api/products")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let item in data) {
        document.querySelector("#items").innerHTML += showItems(data[item]);
      }
    });
}

updateItems();
