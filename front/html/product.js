// Permet de récupérer l'id du produit contenu dans l'url

var itemUrl = window.location.href;
var url = new URL(itemUrl);
let idItem = url.searchParams.get("id");
console.log(idItem);
let item = "";

const colorPicked = document.querySelector("#colors");
const quantityPicked = document.querySelector("#quantity");

// Fonction pour récupérer les données de l'API grace à l'ID
function getItem() {
  // Récupération des articles de l'API

  fetch("http://localhost:3000/api/products/" + idItem)
    .then(function (response) {
      return response.json();
    })

    // J'exporte les données et affiche les caractéristiques du produit grace à la fonction "showItem"

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
  // Affichage de l'image
  let imgItem = document.createElement("img");
  document.querySelector(".item__img").appendChild(imgItem);
  imgItem.src = article.imageUrl;
  imgItem.alt = article.altTxt;

  // Affichage du nom du produit
  document.querySelector("#title").innerHTML = article.name;

  // Affichage du prix
  document.querySelector("#price").innerHTML = article.price;

  // Affichage de la description
  document.querySelector("#description").innerHTML = article.description;

  // Affichage des couleurs disponibles
  for (let color of article.colors) {
    let colorOfItem = document.createElement("option");
    document.querySelector("#colors").appendChild(colorOfItem),
      (colorOfItem.value = color);
    colorOfItem.innerHTML = color;
  }
}

getItem();

// Fonction pour envoyer les infos du canapé au clic sur le bouton

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
    if (productQuantity.value !== 0 && colorChoice.value !== "") {
      let cartSaved = JSON.parse(localStorage.getItem("myCart"));
      if (cartSaved) {
        // Permet de controler l'existence du produit dans le panier (même ID et même couleur)
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
  });
}

// /**
//  * Validate user input to add to cart.
//  *
//  * @param {HTMLElement} el Template element
//  * @param {Product} data
//  */
// function validateCartInput(el, data) {
//   const errors = [];

//   /** @type {HTMLSelectElement} */
//   const colorsSelect = el.querySelector("#colors");
//   /** @type {HTMLInputElement} */
//   const quantityInput = el.querySelector("#quantity");
//   const minQuantity = quantityInput.min || 1;
//   const maxQuantity = quantityInput.max || 1;

//   const color = colorsSelect.value || null;
//   const quantity = quantityInput.valueAsNumber || 0;

//   // validate color
//   if (!color) {
//     errors.push(new ValidationEntryError("Veuillez choisir une couleur"));
//   } else if (!data.colors.includes(color)) {
//     errors.push(new ValidationEntryError("Couleur inconnue"));
//   }

//   // validate quantity
//   if (!Number.isInteger(quantity)) {
//     errors.push(new ValidationEntryError("Quantité invalide"));
//   } else if (quantity < minQuantity || quantity > maxQuantity) {
//     errors.push(
//       new ValidationEntryError(
//         `Veuillez choisir une quantité comprise entre ${minQuantity} et ${maxQuantity}`
//       )
//     );
//   }

//   if (errors.length === 0) {
//     return { color, quantity };
//   }

//   const err = new ValidationError(errors);

//   throw err;
// }

// Sauvegarde le panier dans le localStorage et sérialise la variable
function saveCart(cart) {
  localStorage.setItem("myCart", JSON.stringify(cart));
}
