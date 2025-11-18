// Mobile Navigation
const hamburger = document.querySelector(".nav__hamburger");
const navMenu = document.querySelector(".nav__menu");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Close mobile menu when clicking on links
document.querySelectorAll(".nav__menu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (hamburger) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (header) {
    if (window.scrollY > 100) {
      header.style.background = "rgba(10, 10, 10, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(220, 38, 38, 0.1)";
    } else {
      header.style.background = "rgba(10, 10, 10, 0.95)";
      header.style.boxShadow = "none";
    }
  }
});

/// ==================== ATUALIZAR HEADER COM CARRINHO ====================
function updateHeaderWithCart() {
  const navActions = document.querySelector(".nav__actions");
  const loginMenuLink = document.querySelector("#loginMenuLink");

  if (!navActions) return;

  const usuarioId = localStorage.getItem("usuario_id");
  const usuarioNome = localStorage.getItem("usuario_nome");

  if (usuarioId) {
    navActions.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user"></i>
                <span>Olá, ${usuarioNome || "Usuário"}</span>
            </div>
            <button class="cart-icon" onclick="cart.openCart()">
                <i class="fas fa-shopping-cart"></i>
            </button>
            <button class="btn-logout" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Sair
            </button>
        `;

    // Atualizar link do menu para perfil
    if (loginMenuLink) {
      loginMenuLink.innerHTML =
        '<i class="fas fa-user-circle"></i> Minha Conta';
      loginMenuLink.href = "#agendamentos";
    }
  } else {
    navActions.innerHTML = `
            <a href="login.html" class="btn btn--login">
                <i class="fas fa-sign-in-alt"></i> Entrar
            </a>
            <a href="cadastro.html" class="btn btn--register">
                <i class="fas fa-user-plus"></i> Registrar
            </a>
        `;

    // Restaurar link original do menu
    if (loginMenuLink) {
      loginMenuLink.innerHTML = "Login/Cadastro";
      loginMenuLink.href = "#login-cadastro";
    }
  }
}

// ==================== FUNÇÕES GLOBAIS ====================
function logout() {
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("usuario_nome");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

// ==================== SHOPPING CART ATUALIZADO ====================
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.init();
  }

  init() {
    this.updateCartIcon();
    this.setupCartListeners();
  }

  setupCartListeners() {
    // Adicionar produtos ao carrinho
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn--primary") &&
        e.target.textContent === "Comprar"
      ) {
        const productCard = e.target.closest(".product__card");
        if (productCard) {
          this.addToCart(productCard);
        }
      }
    });
  }

  addToCart(productCard) {
    // Verificar se usuário está logado
    if (!localStorage.getItem("usuario_id")) {
      alert("Por favor, faça login para adicionar produtos ao carrinho!");
      window.location.href = "login.html";
      return;
    }

    const product = {
      id: this.generateProductId(productCard),
      name: productCard.querySelector("h4").textContent,
      price: this.parsePrice(productCard.querySelector(".price").textContent),
      image: productCard.querySelector("img").src,
      quantity: 1,
    };

    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push(product);
    }

    this.saveCart();
    this.updateCartIcon();
    this.showAddToCartMessage(product.name);
  }

  generateProductId(productCard) {
    return btoa(productCard.querySelector("h4").textContent).substring(0, 10);
  }

  parsePrice(priceText) {
    return parseFloat(
      priceText.replace("R$ ", "").replace(".", "").replace(",", ".")
    );
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartIcon();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
        this.updateCartIcon();
      }
    }
  }

  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  updateCartIcon() {
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      const count = this.getTotalItems();
      let badge = cartIcon.querySelector(".cart-count");

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-count";
        cartIcon.appendChild(badge);
      }

      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  showAddToCartMessage(productName) {
    // Criar mensagem flutuante
    const message = document.createElement("div");
    message.className = "cart-message";
    message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${productName} adicionado ao carrinho!
        `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.add("show");
    }, 100);

    setTimeout(() => {
      message.classList.remove("show");
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 300);
    }, 3000);
  }

  // Renderizar carrinho
  renderCart() {
    if (this.cart.length === 0) {
      return `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione alguns produtos incríveis!</p>
                </div>
            `;
    }

    return `
            <div class="cart-items">
                ${this.cart
                  .map(
                    (item) => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">R$ ${item.price.toFixed(
                              2
                            )}</p>
                            <div class="cart-item-controls">
                                <button class="btn-quantity" onclick="cart.updateQuantity('${
                                  item.id
                                }', ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="btn-quantity" onclick="cart.updateQuantity('${
                                  item.id
                                }', ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="btn-remove" onclick="cart.removeFromCart('${
                                  item.id
                                }')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="cart-total">
                <strong>Total: R$ ${this.getTotalPrice().toFixed(2)}</strong>
            </div>
            <div class="cart-actions">
                <button class="btn btn--secondary" onclick="cart.closeCart()">Continuar Comprando</button>
                <button class="btn btn--primary" onclick="cart.checkout()">Finalizar Compra</button>
            </div>
        `;
  }

  openCart() {
    // Criar modal do carrinho
    const modal = document.createElement("div");
    modal.className = "cart-modal";
    modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Meu Carrinho</h3>
                    <button class="btn-close" onclick="cart.closeCart()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-body">
                    ${this.renderCart()}
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    setTimeout(() => {
      modal.classList.add("show");
    }, 100);

    // Fechar ao clicar fora
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeCart();
      }
    });
  }

  closeCart() {
    const modal = document.querySelector(".cart-modal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    }
  }

  checkout() {
    if (this.cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Verificar se usuário está logado
    if (!localStorage.getItem("usuario_id")) {
      alert("Por favor, faça login para finalizar a compra!");
      window.location.href = "login.html";
      return;
    }

    // Criar mensagem para WhatsApp
    const usuarioNome = localStorage.getItem("usuario_nome") || "Cliente";
    const total = this.getTotalPrice().toFixed(2);

    let mensagem = `🛒 *PEDIDO DE COMPRA - Sport Gun Imports*\n\n`;
    mensagem += `👤 *Cliente:* ${usuarioNome}\n`;
    mensagem += `📞 *Telefone:* [Cliente informará]\n\n`;
    mensagem += `*ITENS DO PEDIDO:*\n`;

    this.cart.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.name}\n`;
      mensagem += `   Quantidade: ${item.quantity}\n`;
      mensagem += `   Preço: R$ ${item.price.toFixed(2)}\n\n`;
    });

    mensagem += `💰 *TOTAL: R$ ${total}*\n\n`;
    mensagem += `💳 *FORMA DE PAGAMENTO:*\n`;
    mensagem += `[Cliente escolherá no WhatsApp]\n\n`;
    mensagem += `📍 *ENTREGA:*\n`;
    mensagem += `[Cliente informará endereço]\n\n`;
    mensagem += `_Pedido gerado via site em ${new Date().toLocaleDateString(
      "pt-BR"
    )}_`;

    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/5511999999999?text=${mensagemCodificada}`;

    // Abrir WhatsApp
    window.open(urlWhatsApp, "_blank");

    // Mostrar confirmação
    this.mostrarNotificacao(
      "Pedido Encaminhado!",
      "Seu pedido foi enviado para nosso WhatsApp. Aguarde nosso retorno para confirmar.",
      "success"
    );

    // Limpar carrinho após envio
    this.cart = [];
    this.saveCart();
    this.updateCartIcon();
    this.closeCart();
  }

  mostrarNotificacao(titulo, mensagem, tipo = "success") {
    const notificacao = document.createElement("div");
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = `
            <div class="notificacao-icon">
                ${
                  tipo === "success"
                    ? '<i class="fas fa-check-circle"></i>'
                    : tipo === "error"
                    ? '<i class="fas fa-exclamation-circle"></i>'
                    : '<i class="fas fa-exclamation-triangle"></i>'
                }
            </div>
            <div class="notificacao-content">
                <h4>${titulo}</h4>
                <p>${mensagem}</p>
            </div>
            <button class="btn-fechar-notificacao" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
      notificacao.classList.add("show");
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (notificacao.parentNode) {
        notificacao.classList.remove("show");
        setTimeout(() => {
          if (notificacao.parentNode) {
            notificacao.parentNode.removeChild(notificacao);
          }
        }, 300);
      }
    }, 5000);
  }
}

// ==================== ATUALIZAR BOTÕES DOS PRODUTOS ====================
function atualizarBotoesProdutos() {
  document.querySelectorAll(".product__card").forEach((card) => {
    const priceContainer = card.querySelector(".product__price");
    if (priceContainer && !priceContainer.querySelector(".btn-agendar")) {
      const agendarBtn = document.createElement("button");
      agendarBtn.className = "btn-agendar";
      agendarBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Agendar';

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "product__actions";

      // Mover botão comprar para actions
      const comprarBtn = priceContainer.querySelector(".btn--primary");
      if (comprarBtn) {
        priceContainer.removeChild(comprarBtn);
        actionsDiv.appendChild(comprarBtn);
      }

      actionsDiv.appendChild(agendarBtn);
      card.querySelector(".product__info").appendChild(actionsDiv);
    }
  });
}

// ==================== INICIALIZAÇÃO ====================
let cart;
let whatsApp;

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Página carregada! Inicializando componentes...");

  // Inicializar carrinho
  cart = new ShoppingCart();
  console.log("✅ Carrinho inicializado");

  // Inicializar WhatsApp
  whatsApp = new WhatsAppIntegration();
  console.log("✅ WhatsApp integration inicializada");

  // Atualizar header
  updateHeaderWithCart();

  // Atualizar botões dos produtos
  atualizarBotoesProdutos();

  // Inicializar carrossel
  const carousel = new Carousel();
  console.log("✅ Carrossel inicializado");

  // Carregar notícias
  loadNews();

  console.log("✅ Todos os componentes inicializados!");
});
// ==================== CARRINHO DE COMPRAS ====================
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.init();
  }

  init() {
    this.updateCartIcon();
    this.setupCartListeners();
  }

  setupCartListeners() {
    // Adicionar produtos ao carrinho
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn--primary") &&
        e.target.textContent === "Comprar"
      ) {
        const productCard = e.target.closest(".product__card");
        if (productCard) {
          this.addToCart(productCard);
        }
      }
    });
  }

  addToCart(productCard) {
    // Verificar se usuário está logado
    if (!localStorage.getItem("usuario_id")) {
      alert("Por favor, faça login para adicionar produtos ao carrinho!");
      window.location.href = "login.html";
      return;
    }

    const product = {
      id: this.generateProductId(productCard),
      name: productCard.querySelector("h4").textContent,
      price: this.parsePrice(productCard.querySelector(".price").textContent),
      image: productCard.querySelector("img").src,
      quantity: 1,
    };

    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push(product);
    }

    this.saveCart();
    this.updateCartIcon();
    this.showAddToCartMessage(product.name);
  }

  generateProductId(productCard) {
    return btoa(productCard.querySelector("h4").textContent).substring(0, 10);
  }

  parsePrice(priceText) {
    return parseFloat(
      priceText.replace("R$ ", "").replace(".", "").replace(",", ".")
    );
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartIcon();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
        this.updateCartIcon();
      }
    }
  }

  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  updateCartIcon() {
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      const count = this.getTotalItems();
      const badge =
        cartIcon.querySelector(".cart-count") || document.createElement("span");
      badge.className = "cart-count";
      badge.textContent = count;

      if (!cartIcon.querySelector(".cart-count")) {
        cartIcon.appendChild(badge);
      }

      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  showAddToCartMessage(productName) {
    // Criar mensagem flutuante
    const message = document.createElement("div");
    message.className = "cart-message";
    message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${productName} adicionado ao carrinho!
        `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.add("show");
    }, 100);

    setTimeout(() => {
      message.classList.remove("show");
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 300);
    }, 3000);
  }

  // Renderizar carrinho
  renderCart() {
    if (this.cart.length === 0) {
      return `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione alguns produtos incríveis!</p>
                </div>
            `;
    }

    return `
            <div class="cart-items">
                ${this.cart
                  .map(
                    (item) => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">R$ ${item.price.toFixed(
                              2
                            )}</p>
                            <div class="cart-item-controls">
                                <button class="btn-quantity" onclick="cart.updateQuantity('${
                                  item.id
                                }', ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="btn-quantity" onclick="cart.updateQuantity('${
                                  item.id
                                }', ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="btn-remove" onclick="cart.removeFromCart('${
                                  item.id
                                }')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="cart-total">
                <strong>Total: R$ ${this.getTotalPrice().toFixed(2)}</strong>
            </div>
            <div class="cart-actions">
                <button class="btn btn--secondary" onclick="cart.closeCart()">Continuar Comprando</button>
                <button class="btn btn--primary" onclick="cart.checkout()">Finalizar Compra</button>
            </div>
        `;
  }

  openCart() {
    // Criar modal do carrinho
    const modal = document.createElement("div");
    modal.className = "cart-modal";
    modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Meu Carrinho</h3>
                    <button class="btn-close" onclick="cart.closeCart()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-body">
                    ${this.renderCart()}
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    setTimeout(() => {
      modal.classList.add("show");
    }, 100);

    // Fechar ao clicar fora
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeCart();
      }
    });
  }

  closeCart() {
    const modal = document.querySelector(".cart-modal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    }
  }

  checkout() {
    if (this.cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    alert(`Compra finalizada! Total: R$ ${this.getTotalPrice().toFixed(2)}`);
    this.cart = [];
    this.saveCart();
    this.updateCartIcon();
    this.closeCart();
  }
}

// ==================== CSS DO CARRINHO ====================
const cartStyles = `
/* Carrinho Styles */
.cart-icon {
    position: relative;
    cursor: pointer;
    padding: 10px;
    border-radius: var(--radius-md);
    transition: var(--transition);
    color: var(--text-primary);
}

.cart-icon:hover {
    color: var(--primary-color);
    background: rgba(220, 38, 38, 0.1);
}

.cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

/* Modal do Carrinho */
.cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
}

.cart-modal.show {
    opacity: 1;
    visibility: visible;
}

.cart-modal-content {
    background: var(--background-card);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    transform: translateY(50px);
    transition: var(--transition);
    border: 1px solid var(--border-color);
}

.cart-modal.show .cart-modal-content {
    transform: translateY(0);
}

.cart-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--background-light);
}

.cart-header h3 {
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 5px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
}

.btn-close:hover {
    color: var(--primary-color);
    background: rgba(220, 38, 38, 0.1);
}

.cart-body {
    padding: 1.5rem;
    max-height: 400px;
    overflow-y: auto;
}

/* Itens do Carrinho */
.empty-cart {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.empty-cart i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--border-color);
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cart-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--background);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
}

.cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--radius-sm);
}

.cart-item-info {
    flex: 1;
}

.cart-item-info h4 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.cart-item-price {
    color: var(--primary-color);
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.cart-item-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-quantity, .btn-remove {
    background: var(--background-light);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    width: 30px;
    height: 30px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-quantity:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.btn-remove:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.quantity {
    padding: 0 10px;
    font-weight: 600;
    color: var(--text-primary);
}

.cart-total {
    padding: 1.5rem 0;
    border-top: 1px solid var(--border-color);
    text-align: center;
    font-size: 1.2rem;
    color: var(--text-primary);
}

.cart-actions {
    display: flex;
    gap: 1rem;
}

.cart-actions .btn {
    flex: 1;
}

/* Mensagem de Adição */
.cart-message {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-hover);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10001;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.cart-message.show {
    transform: translateX(0);
}

/* Header com Carrinho */
.nav__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-primary);
    font-size: 0.9rem;
}

.btn-logout {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 8px 16px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.8rem;
}

.btn-logout:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}
`;

// Adicionar CSS do carrinho ao documento
const styleSheet = document.createElement("style");
styleSheet.textContent = cartStyles;
document.head.appendChild(styleSheet);

// ==================== ATUALIZAR HEADER COM CARRINHO ====================
function updateHeaderWithCart() {
  const navActions = document.querySelector(".nav__actions");
  if (!navActions) return;

  const usuarioId = localStorage.getItem("usuario_id");
  const usuarioNome = localStorage.getItem("usuario_nome");

  if (usuarioId) {
    navActions.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user"></i>
                <span>Olá, ${usuarioNome || "Usuário"}</span>
            </div>
            <div class="cart-icon" onclick="cart.openCart()">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <button class="btn-logout" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Sair
            </button>
        `;
  } else {
    navActions.innerHTML = `
            <a href="login.html" class="btn btn--login">Entrar</a>
            <a href="cadastro.html" class="btn btn--register">Registrar</a>
        `;
  }
}

// ==================== FUNÇÕES GLOBAIS ====================
function logout() {
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("usuario_nome");
  window.location.href = "index.html";
}

// ==================== INICIALIZAÇÃO ====================
let cart;

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Página carregada! Inicializando componentes...");

  // Inicializar carrinho
  cart = new ShoppingCart();
  console.log("✅ Carrinho inicializado");

  // Atualizar header
  updateHeaderWithCart();

  // Inicializar carrossel
  const carousel = new Carousel();
  console.log("✅ Carrossel inicializado");

  // Carregar notícias
  loadNews();

  console.log("✅ Todos os componentes inicializados!");
});
// ==================== WHATSAPP INTEGRATION ====================
class WhatsAppIntegration {
  constructor() {
    this.phoneNumber = "5511999999999"; // Substitua pelo seu número
    this.businessName = "Sport Gun Imports";
    this.agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    this.init();
  }

  init() {
    this.createFloatingButton();
    this.setupAgendamentoListeners();
    this.renderAgendamentosList();
  }

  createFloatingButton() {
    const floatingBtn = document.createElement("div");
    floatingBtn.className = "whatsapp-floating";
    floatingBtn.innerHTML = `
            <a href="https://wa.me/${this.phoneNumber}" target="_blank" class="whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
                <span class="whatsapp-tooltip">Fale conosco no WhatsApp</span>
            </a>
        `;
    document.body.appendChild(floatingBtn);
  }

  setupAgendamentoListeners() {
    // Adicionar botão de agendamento nos produtos
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("btn-agendar") ||
        e.target.closest(".btn-agendar")
      ) {
        const productCard = e.target.closest(".product__card");
        if (productCard) {
          this.openAgendamentoModal(productCard);
        }
      }
    });

    // Botão de agendamento geral
    const agendarBtn = document.querySelector(".btn-agendamento-geral");
    if (agendarBtn) {
      agendarBtn.addEventListener("click", () => this.openAgendamentoModal());
    }
  }

  openAgendamentoModal(productCard = null) {
    const productName = productCard
      ? productCard.querySelector("h4").textContent
      : "Produto/Serviço";
    const productPrice = productCard
      ? productCard.querySelector(".price").textContent
      : "";

    const modal = document.createElement("div");
    modal.className = "agendamento-modal";
    modal.innerHTML = `
            <div class="agendamento-modal-content">
                <div class="agendamento-header">
                    <h3><i class="fas fa-calendar-plus"></i> Agendar Atendimento</h3>
                    <button class="btn-close" onclick="whatsApp.closeAgendamentoModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="agendamento-body">
                    <form id="agendamentoForm" class="agendamento-form">
                        <div class="form-group">
                            <label for="clienteNome"><i class="fas fa-user"></i> Nome Completo</label>
                            <input type="text" id="clienteNome" required 
                                   value="${
                                     localStorage.getItem("usuario_nome") || ""
                                   }">
                        </div>
                        
                        <div class="form-group">
                            <label for="clienteTelefone"><i class="fas fa-phone"></i> Telefone/WhatsApp</label>
                            <input type="tel" id="clienteTelefone" required 
                                   placeholder="(11) 99999-9999">
                        </div>
                        
                        <div class="form-group">
                            <label for="produtoServico"><i class="fas fa-gun"></i> Produto/Serviço</label>
                            <input type="text" id="produtoServico" required 
                                   value="${productName}">
                        </div>
                        
                        <div class="form-group">
                            <label for="dataAgendamento"><i class="fas fa-calendar-day"></i> Data Preferencial</label>
                            <input type="date" id="dataAgendamento" required 
                                   min="${
                                     new Date().toISOString().split("T")[0]
                                   }">
                        </div>
                        
                        <div class="form-group">
                            <label for="horarioAgendamento"><i class="fas fa-clock"></i> Horário Preferencial</label>
                            <select id="horarioAgendamento" required>
                                <option value="">Selecione um horário</option>
                                <option value="08:00">08:00</option>
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="observacoes"><i class="fas fa-sticky-note"></i> Observações</label>
                            <textarea id="observacoes" placeholder="Alguma informação adicional..."></textarea>
                        </div>
                        
                        <div class="agendamento-actions">
                            <button type="button" class="btn btn--secondary" onclick="whatsApp.closeAgendamentoModal()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn--primary">
                                <i class="fab fa-whatsapp"></i> Agendar via WhatsApp
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    setTimeout(() => {
      modal.classList.add("show");
    }, 100);

    // Fechar ao clicar fora
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeAgendamentoModal();
      }
    });

    // Submeter formulário
    const form = modal.querySelector("#agendamentoForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.enviarAgendamentoWhatsApp();
    });
  }

  closeAgendamentoModal() {
    const modal = document.querySelector(".agendamento-modal");
    if (modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    }
  }

  enviarAgendamentoWhatsApp() {
    const formData = {
      nome: document.getElementById("clienteNome").value,
      telefone: document.getElementById("clienteTelefone").value,
      produto: document.getElementById("produtoServico").value,
      data: document.getElementById("dataAgendamento").value,
      horario: document.getElementById("horarioAgendamento").value,
      observacoes: document.getElementById("observacoes").value,
    };

    // Validar dados
    if (!this.validarAgendamento(formData)) {
      return;
    }

    // Criar agendamento
    const agendamento = {
      id: this.generateAgendamentoId(),
      ...formData,
      status: "pendente",
      dataCriacao: new Date().toISOString(),
    };

    // Salvar agendamento
    this.agendamentos.push(agendamento);
    this.salvarAgendamentos();

    // Criar mensagem para WhatsApp
    const mensagem = this.criarMensagemWhatsApp(agendamento);
    const urlWhatsApp = `https://wa.me/${
      this.phoneNumber
    }?text=${encodeURIComponent(mensagem)}`;

    // Abrir WhatsApp
    window.open(urlWhatsApp, "_blank");

    // Fechar modal e mostrar confirmação
    this.closeAgendamentoModal();
    this.mostrarNotificacao(
      "Agendamento Criado!",
      "Enviamos os detalhes para seu WhatsApp. Aguarde nossa confirmação.",
      "success"
    );

    // Enviar notificação automática (simulação)
    this.enviarNotificacaoAutomatica(agendamento);
  }

  validarAgendamento(formData) {
    if (
      !formData.nome ||
      !formData.telefone ||
      !formData.produto ||
      !formData.data ||
      !formData.horario
    ) {
      this.mostrarNotificacao(
        "Erro",
        "Preencha todos os campos obrigatórios.",
        "error"
      );
      return false;
    }

    // Validar telefone
    const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    if (!telefoneRegex.test(formData.telefone.replace(/\s/g, ""))) {
      this.mostrarNotificacao("Erro", "Digite um telefone válido.", "error");
      return false;
    }

    // Validar data
    const dataAgendamento = new Date(formData.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataAgendamento < hoje) {
      this.mostrarNotificacao("Erro", "A data deve ser futura.", "error");
      return false;
    }

    return true;
  }

  criarMensagemWhatsApp(agendamento) {
    const dataFormatada = new Date(agendamento.data).toLocaleDateString(
      "pt-BR"
    );

    return `🛒 *NOVO AGENDAMENTO - ${this.businessName}*

👤 *Cliente:* ${agendamento.nome}
📞 *Telefone:* ${agendamento.telefone}
🔫 *Produto/Serviço:* ${agendamento.produto}
📅 *Data:* ${dataFormatada}
⏰ *Horário:* ${agendamento.horario}
📝 *Observações:* ${agendamento.observacoes || "Nenhuma"}

_Agendamento criado via site em ${new Date().toLocaleDateString("pt-BR")}_

Por favor, confirme este agendamento respondendo:
✅ *CONFIRMAR* - Para confirmar o agendamento
❌ *CANCELAR* - Para cancelar o agendamento`;
  }

  generateAgendamentoId() {
    return "agd_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  salvarAgendamentos() {
    localStorage.setItem("agendamentos", JSON.stringify(this.agendamentos));
  }

  mostrarNotificacao(titulo, mensagem, tipo = "success") {
    const notificacao = document.createElement("div");
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = `
            <div class="notificacao-icon">
                ${
                  tipo === "success"
                    ? '<i class="fas fa-check-circle"></i>'
                    : tipo === "error"
                    ? '<i class="fas fa-exclamation-circle"></i>'
                    : '<i class="fas fa-exclamation-triangle"></i>'
                }
            </div>
            <div class="notificacao-content">
                <h4>${titulo}</h4>
                <p>${mensagem}</p>
            </div>
            <button class="btn-fechar-notificacao" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
      notificacao.classList.add("show");
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (notificacao.parentNode) {
        notificacao.classList.remove("show");
        setTimeout(() => {
          if (notificacao.parentNode) {
            notificacao.parentNode.removeChild(notificacao);
          }
        }, 300);
      }
    }, 5000);
  }

  enviarNotificacaoAutomatica(agendamento) {
    // Simulação de notificação automática após 1 minuto
    setTimeout(() => {
      this.mostrarNotificacao(
        "Lembrete de Agendamento",
        `Não se esqueça do seu agendamento para ${
          agendamento.produto
        } no dia ${new Date(agendamento.data).toLocaleDateString("pt-BR")} às ${
          agendamento.horario
        }.`,
        "warning"
      );
    }, 60000); // 1 minuto

    // Simulação de confirmação automática após 2 minutos
    setTimeout(() => {
      this.simularConfirmacaoAgendamento(agendamento.id);
    }, 120000); // 2 minutos
  }

  simularConfirmacaoAgendamento(agendamentoId) {
    const agendamento = this.agendamentos.find((a) => a.id === agendamentoId);
    if (agendamento && agendamento.status === "pendente") {
      agendamento.status = "confirmado";
      agendamento.dataConfirmacao = new Date().toISOString();
      this.salvarAgendamentos();
      this.renderAgendamentosList();

      this.mostrarNotificacao(
        "Agendamento Confirmado!",
        `Seu agendamento para ${agendamento.produto} foi confirmado. Te esperamos!`,
        "success"
      );
    }
  }

  renderAgendamentosList() {
    const agendamentosContainer = document.querySelector(".agendamentos-list");
    if (!agendamentosContainer) return;

    if (this.agendamentos.length === 0) {
      agendamentosContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Nenhum agendamento encontrado</h3>
                    <p>Faça seu primeiro agendamento!</p>
                </div>
            `;
      return;
    }

    agendamentosContainer.innerHTML = this.agendamentos
      .map(
        (agendamento) => `
            <div class="agendamento-item">
                <div class="agendamento-info">
                    <div class="agendamento-details">
                        <h4>${agendamento.produto}</h4>
                        <p><i class="fas fa-user"></i> ${agendamento.nome}</p>
                        <p><i class="fas fa-calendar"></i> ${new Date(
                          agendamento.data
                        ).toLocaleDateString("pt-BR")} às ${
          agendamento.horario
        }</p>
                        <p><i class="fas fa-phone"></i> ${
                          agendamento.telefone
                        }</p>
                    </div>
                    <div class="agendamento-status">
                        <span class="status-${agendamento.status}">
                            <i class="fas fa-circle"></i>
                            ${
                              agendamento.status === "pendente"
                                ? "Pendente"
                                : agendamento.status === "confirmado"
                                ? "Confirmado"
                                : "Cancelado"
                            }
                        </span>
                    </div>
                </div>
                ${
                  agendamento.observacoes
                    ? `
                    <div class="agendamento-observacoes">
                        <p><strong>Observações:</strong> ${agendamento.observacoes}</p>
                    </div>
                `
                    : ""
                }
                ${
                  agendamento.status === "pendente"
                    ? `
                    <div class="agendamento-actions-small">
                        <button class="btn-confirmar" onclick="whatsApp.confirmarAgendamento('${agendamento.id}')">
                            <i class="fas fa-check"></i> Confirmar
                        </button>
                        <button class="btn-cancelar" onclick="whatsApp.cancelarAgendamento('${agendamento.id}')">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `
      )
      .join("");
  }

  confirmarAgendamento(agendamentoId) {
    const agendamento = this.agendamentos.find((a) => a.id === agendamentoId);
    if (agendamento) {
      agendamento.status = "confirmado";
      agendamento.dataConfirmacao = new Date().toISOString();
      this.salvarAgendamentos();
      this.renderAgendamentosList();

      this.mostrarNotificacao(
        "Agendamento Confirmado!",
        "Agendamento confirmado com sucesso.",
        "success"
      );

      // Enviar mensagem de confirmação para WhatsApp
      this.enviarMensagemConfirmacao(agendamento);
    }
  }

  cancelarAgendamento(agendamentoId) {
    const agendamento = this.agendamentos.find((a) => a.id === agendamentoId);
    if (agendamento) {
      agendamento.status = "cancelado";
      agendamento.dataCancelamento = new Date().toISOString();
      this.salvarAgendamentos();
      this.renderAgendamentosList();

      this.mostrarNotificacao(
        "Agendamento Cancelado",
        "Agendamento cancelado com sucesso.",
        "error"
      );
    }
  }

  enviarMensagemConfirmacao(agendamento) {
    const mensagem = `✅ *AGENDAMENTO CONFIRMADO - ${this.businessName}*

Olá ${agendamento.nome}! 

Seu agendamento foi *CONFIRMADO*:

🔫 *Produto/Serviço:* ${agendamento.produto}
📅 *Data:* ${new Date(agendamento.data).toLocaleDateString("pt-BR")}
⏰ *Horário:* ${agendamento.horario}

📍 *Local:* [Endereço da Loja]
📞 *Telefone:* [Telefone da Loja]

*IMPORTANTE:*
- Chegue com 15 minutos de antecedência
- Traga documentação necessária
- Em caso de impedimento, avise com antecedência

Agradecemos pela preferência! 🎯`;

    const urlWhatsApp = `https://wa.me/${agendamento.telefone.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, "_blank");
  }
}

// ==================== ATUALIZAR BOTÕES DOS PRODUTOS ====================
function atualizarBotoesProdutos() {
  document.querySelectorAll(".product__card").forEach((card) => {
    const priceContainer = card.querySelector(".product__price");
    if (priceContainer && !priceContainer.querySelector(".btn-agendar")) {
      const agendarBtn = document.createElement("button");
      agendarBtn.className = "btn-agendar";
      agendarBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Agendar';

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "product__actions";

      // Mover botão comprar para actions
      const comprarBtn = priceContainer.querySelector(".btn--primary");
      if (comprarBtn) {
        priceContainer.removeChild(comprarBtn);
        actionsDiv.appendChild(comprarBtn);
      }

      actionsDiv.appendChild(agendarBtn);
      card.querySelector(".product__info").appendChild(actionsDiv);
    }
  });
}
