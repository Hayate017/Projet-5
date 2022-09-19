// Récupération de l'Id dans l'URL
var idUrl = window.location.href;
var url = new URL(idUrl);
let showOrderId = url.searchParams.get("orderId");

// Affichage de l'Id dans le HTML
document.querySelector("#orderId").innerHTML = showOrderId;
