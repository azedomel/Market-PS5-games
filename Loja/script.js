// let items = document.querySelectorAll('.slider .list .item');
// let next = document.getElementById('next');
// let prev = document.getElementById('prev');
// let thumbnails = document.querySelectorAll('.thumbnail .item');

// // config param
// let countItem = items.length;
// let itemActive = 0;
// let refreshInterval;

// function initSlider() {
//     // Set initial active item
//     items[itemActive].classList.add('active');
//     thumbnails[itemActive].classList.add('active');
//     setPositionThumbnail();
    
//     // Start auto slider
//     startAutoSlide();
// }

// // event next click
// next.onclick = function() {
//     itemActive = (itemActive + 1) % countItem;
//     showSlider();
// }

// // event prev click
// prev.onclick = function() {
//     itemActive = (itemActive - 1 + countItem) % countItem;
//     showSlider();
// }

// function startAutoSlide() {
//     refreshInterval = setInterval(() => {
//         next.click();
//     }, 5000);
// }

// function showSlider() {
//     // remove item active old
//     let itemActiveOld = document.querySelector('.slider .list .item.active');
//     let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
//     if (itemActiveOld) itemActiveOld.classList.remove('active');
//     if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

//     // active new item
//     items[itemActive].classList.add('active');
//     thumbnails[itemActive].classList.add('active');
//     setPositionThumbnail();

//     // reset auto slider
//     resetAutoSlide();
// }

// function setPositionThumbnail() {
//     let thumbnailActive = document.querySelector('.thumbnail .item.active');
//     if (thumbnailActive) {
//         thumbnailActive.scrollIntoView({
//             behavior: 'smooth',
//             inline: 'center',
//             block: 'nearest'
//         });
//     }
// }

// function resetAutoSlide() {
//     clearInterval(refreshInterval);
//     startAutoSlide();
// }

// // click thumbnail
// thumbnails.forEach((thumbnail, index) => {
//     thumbnail.addEventListener('click', () => {
//         itemActive = index;
//         showSlider();
//     });
// });

// // Initialize slider
// initSlider();

// // Pause on hover
// document.querySelector('.slider').addEventListener('mouseenter', () => {
//     clearInterval(refreshInterval);
// });

// document.querySelector('.slider').addEventListener('mouseleave', () => {
//     resetAutoSlide();
// });

// // Touch events for mobile
// let touchStartX = 0;
// let touchEndX = 0;

// document.querySelector('.slider').addEventListener('touchstart', (e) => {
//     touchStartX = e.changedTouches[0].screenX;
// }, {passive: true});

// document.querySelector('.slider').addEventListener('touchend', (e) => {
//     touchEndX = e.changedTouches[0].screenX;
//     handleSwipe();
// }, {passive: true});

// function handleSwipe() {
//     if (touchEndX < touchStartX - 50) {
//         next.click();
//     }
//     if (touchEndX > touchStartX + 50) {
//         prev.click();
//     }
// }

// Declaração da variável produtos fora do escopo do evento para torná-la global
let produtos;

window.onload = function () {
  var storedUser = localStorage.getItem("usuario");
  var user = JSON.parse(storedUser);
  document.getElementById("user").textContent = user.name;
  document.getElementById("perfil").textContent = user.name;
  document.getElementById("idPerfil").textContent = user.id;
};

document.addEventListener("DOMContentLoaded", function () {
  // Fetch dos produtos e armazenamento na variável global
  fetch("../Dados/Dados.json")
    .then((response) => response.json())
    .then((data) => {
      produtos = data;
      const produtosContainer = document.getElementById("produtos-container");

      produtos.forEach((Produto, index) => {
        const card = document.createElement("div");
        card.className = "card";

        const imagem = document.createElement("img");
        imagem.src = Produto.imagem;
        imagem.className = "card-img-top";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardTitle = document.createElement("h1");
        cardTitle.className = "card-title";
        cardTitle.textContent = Produto.Produto;

        const cardDesc = document.createElement("p");
        cardDesc.className = "card-descricao";
        cardDesc.textContent = Produto.descricao;

        const cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.textContent = "Preço: $" + Produto.preco.toFixed(2);

        const btnAdicionarAoCarrinho = document.createElement("a");
        btnAdicionarAoCarrinho.href = "#";
        btnAdicionarAoCarrinho.className =
          "btn btn-primary btn-adicionar-ao-carrinho";
        btnAdicionarAoCarrinho.textContent = "Adicionar ao Carrinho";
        btnAdicionarAoCarrinho.setAttribute("data-indice", index);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDesc);
        cardBody.appendChild(cardText);
        
        cardBody.appendChild(btnAdicionarAoCarrinho);

        card.appendChild(imagem);
        card.appendChild(cardBody);

        produtosContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Erro ao carregar o arquivo JSON", error));

  // Manipulador de eventos para o botão "Adicionar ao Carrinho"
  $("#produtos-container").on(
    "click",
    ".btn-adicionar-ao-carrinho",
    function () {
      const indexDoProduto = $(this).data("indice");
      const produtoSelecionado = produtos[indexDoProduto];
      let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
      carrinho.push(produtoSelecionado);
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      alert("Produto adicionado ao carrinho!");
    }
  );
});

// WhatsApp Form Functionality
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const message = this.querySelector('textarea').value;
    
    // Format the message for WhatsApp
    const whatsappMessage = `Olá! Meu nome é ${name}.\n\nMensagem:\n${message}`;
    
    // Replace with your WhatsApp number
    const whatsappNumber = '5511999999999';
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Clear the form
    this.reset();
});