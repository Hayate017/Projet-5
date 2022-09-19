// Permet de récupérer l'id du produit contenu dans l'url

var itemUrl = window.location.href;
var url = new URL(itemUrl);
let idItem = url.searchParams.get("id");
console.log(idItem);
let item = "";

// Fonction pour récupérer les données de l'API grace à l'ID
function getItem() {
  // Récupération des articles de l'API

  fetch("http://localhost:3000/api/products/" + idItem)
    .then(function (response) {
      return response.json();
    })

    // Utilisation de la fonction "showItem" pour afficher les caractéristiques de produit et exportation des données

    .then(function (data) {
      showItem(data);
      getProductForCart(data);
    })
    .catch(function (error) {
      alert("Erreur de la requête");
    });
}

// Permet d'afficher les caractéristiques du produit

function showItem(article) {
  // Permet d'afficher l'image du produit
  let imgItem = document.createElement("img");
  document.querySelector(".item__img").appendChild(imgItem);
  imgItem.src = article.imageUrl;
  imgItem.alt = article.altTxt;

  // Permet d'afficher le nom du produit
  document.querySelector("#title").innerHTML = article.name;

  // Permet d'afficher le prix du produit
  document.querySelector("#price").innerHTML = article.price;

  // Permet d'afficher la description du produit
  document.querySelector("#description").innerHTML = article.description;

  // Permet d'afficher les couleurs disponibles du produit
  for (let color of article.colors) {
    let colorOfItem = document.createElement("option");
    document.querySelector("#colors").appendChild(colorOfItem),
      (colorOfItem.value = color);
    colorOfItem.innerHTML = color;
  }
}

getItem();

// Fonction pour lier les infos du canapé au clic du bouton

function getProductForCart(product) {
  const addBtn = document.querySelector("#addToCart");
  const colorChoice = document.querySelector("#colors");
  const productQuantity = document.querySelector("#quantity");

  addBtn.addEventListener("click", function () {
    const myProduct = {
      Name: product.name,
      ID: product._id,
      Picture: product.imageUrl,
      PictureTxt: product.altTxt,
      Price: product.price,
      Color: colorChoice.value,
      Quantity: parseInt(productQuantity.value, 10),
    };

    // Permet de contrôler qu'une quantité et une couleur sont bien sélectionnées
    if (productQuantity.value > 0 && colorChoice.value !== "") {
      let cartSaved = JSON.parse(localStorage.getItem("myCart"));
      if (cartSaved) {
        // Permet de vérifier la présence du produit dans le panier
        const productControl = cartSaved.find(
          (sofa) => sofa.ID == product._id && sofa.Color == colorChoice.value
        );
        if (productControl) {
          let finalQuantity = myProduct.Quantity + productControl.Quantity;
          productControl.Quantity = finalQuantity;
          saveCart(cartSaved);
        } else {
          cartSaved.push(myProduct);
          saveCart(cartSaved);
        }
      } else {
        cartSaved = [];
        cartSaved.push(myProduct);
        saveCart(cartSaved);
      }
      alert("Le produit a été ajouté au panier");
    }

    if (productQuantity.value <= 0 && colorChoice.value == "") {
      alert("Veuillez sélectionner une couleur et une quantité");
    } else {
      if (productQuantity.value <= 0 && colorChoice.value !== "") {
        alert("Veuillez sélectionner une quantité");
      } else {
        if (productQuantity.value > 0 && colorChoice.value == "") {
          alert("Veuillez sélectionner une couleur");
        }
      }
    }
  });
}

// Sauvegarde le panier dans le localStorage et octroie un numéro à la variable
function saveCart(cart) {
  localStorage.setItem("myCart", JSON.stringify(cart));
}
