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

// Declaração de variáveis globais
let produtos;
let items;
let thumbnails;
let next;
let prev;
let countItem;
let itemActive = 0;
let refreshInterval;

// Cache de elementos DOM frequentemente usados
const sliderList = document.getElementById('slider-list');
const sliderThumbnails = document.getElementById('slider-thumbnails');
const produtosContainer = document.getElementById("produtos-container");

window.onload = function () {
    const storedUser = localStorage.getItem("usuario");
    const user = JSON.parse(storedUser);
    document.getElementById("user").textContent = user.name;
};

// Função para debounce - limita a frequência de execução
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("../Dados/Dados.json")
        .then((response) => response.json())
        .then((data) => {
            produtos = data;
            setupSlider();
            setupProdutos();
        })
        .catch((error) => console.error("Erro ao carregar o arquivo JSON", error));

    // Manipulador de eventos para o botão "Adicionar ao Carrinho"
    produtosContainer.addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-adicionar-ao-carrinho")) {
            const indexDoProduto = e.target.dataset.indice;
            const produtoSelecionado = produtos[indexDoProduto];
            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
            carrinho.push(produtoSelecionado);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            alert("Produto adicionado ao carrinho!");
        }
    });
});

function setupSlider() {
    if (!sliderList || !sliderThumbnails) return;

    // Limpar os containers
    sliderList.innerHTML = '';
    sliderThumbnails.innerHTML = '';

    // Criar fragmentos para melhor performance
    const sliderFragment = document.createDocumentFragment();
    const thumbnailFragment = document.createDocumentFragment();

    produtos.forEach((produto, index) => {
        // Criar item do slider
        const sliderItem = document.createElement('div');
        sliderItem.className = `item ${index === 0 ? 'active' : ''}`;
        sliderItem.innerHTML = `
            <img src="${produto.imagem2}" alt="${produto.Produto}" loading="lazy">
        `;
        sliderFragment.appendChild(sliderItem);

        // Criar thumbnail
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = `item ${index === 0 ? 'active' : ''}`;
        thumbnailItem.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.Produto}" loading="lazy">
        `;
        thumbnailFragment.appendChild(thumbnailItem);
    });

    sliderList.appendChild(sliderFragment);
    sliderThumbnails.appendChild(thumbnailFragment);

    // Inicializar variáveis do slider
    items = document.querySelectorAll('.slider .list .item');
    next = document.getElementById('next');
    prev = document.getElementById('prev');
    thumbnails = document.querySelectorAll('.thumbnail .item');
    countItem = items.length;

    // Configurar eventos de clique
    if (next && prev) {
        next.onclick = function() {
            itemActive = (itemActive + 1) % countItem;
            showSlider();
        };

        prev.onclick = function() {
            itemActive = (itemActive - 1 + countItem) % countItem;
            showSlider();
        };
    }

    // Configurar eventos de clique nas miniaturas
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            itemActive = index;
            showSlider();
        });
    });

    // Inicializar o slider
    if (items.length > 0) {
        initSlider();
        setupSliderEvents();
    }
}

function setupSliderEvents() {
    const sliderElement = document.querySelector('.slider');
    if (sliderElement) {
        sliderElement.addEventListener('mouseenter', () => {
            clearInterval(refreshInterval);
        });

        sliderElement.addEventListener('mouseleave', () => {
            startAutoSlide();
        });

        setupTouchEvents(sliderElement);
    }
}

function setupProdutos() {
    if (!produtosContainer) return;
    
    produtosContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    produtos.forEach((Produto, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${Produto.imagem}" alt="${Produto.Produto}" class="card-img-top" loading="lazy">
            <div class="card-body">
                <h1 class="card-title">${Produto.Produto}</h1>
                <p class="card-descricao">${Produto.descricao}</p>
                <p class="card-text">Preço: $${Produto.preco.toFixed(2)}</p>
                <a href="#" class="btn btn-primary btn-adicionar-ao-carrinho" data-indice="${index}">
                    Adicionar ao Carrinho
                </a>
            </div>
        `;
        fragment.appendChild(card);
    });

    produtosContainer.appendChild(fragment);
}

function initSlider() {
    if (!items[itemActive]) return;
    
    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');
    setPositionThumbnail();
    startAutoSlide();
}

function startAutoSlide() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    refreshInterval = setInterval(() => {
        itemActive = (itemActive + 1) % countItem;
        showSlider();
    }, 5000);
}

function showSlider() {
    const itemActiveOld = document.querySelector('.slider .list .item.active');
    const thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
    
    if (itemActiveOld) itemActiveOld.classList.remove('active');
    if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

    if (items[itemActive]) {
        items[itemActive].classList.add('active');
        thumbnails[itemActive].classList.add('active');
        setPositionThumbnail();
    }
}

function setPositionThumbnail() {
    const thumbnailActive = document.querySelector('.thumbnail .item.active');
    const thumbnailContainer = document.querySelector('.thumbnail');
    
    if (thumbnailActive && thumbnailContainer) {
        const containerWidth = thumbnailContainer.offsetWidth;
        const thumbnailLeft = thumbnailActive.offsetLeft;
        const thumbnailWidth = thumbnailActive.offsetWidth;
        thumbnailContainer.scrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
    }
}

function setupTouchEvents(element) {
    let touchStartX = 0;
    let touchEndX = 0;

    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            next.click();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prev.click();
        }
    }
}

// WhatsApp Form Functionality
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const message = this.querySelector('textarea').value;
    
    const whatsappMessage = `Olá! Meu nome é ${name}.\n\nMensagem:\n${message}`;
    const whatsappNumber = '5511999999999';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    this.reset();
});