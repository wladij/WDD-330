import { getLocalStorage, alertMessage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(key, outputElement) {
    this.key = key;
    this.outputElement = outputElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];

    if (cartItems.length === 0) {
      this.outputElement.innerHTML = "<p>Your cart is empty.</p>";
      document.querySelector('.list-footer').classList.add('hide');
      return;
    }

    // Render items
    const htmlItems = cartItems.map((item) => this.cartItemTemplate(item));
    this.outputElement.innerHTML = htmlItems.join("");

    // Add listeners
    this.addQuantityListeners();
    this.addRemoveListeners();

    // Update total
    this.updateTotal();
  }

  // -------------------------
  // TEMPLATE
  // -------------------------
  cartItemTemplate(item) {
    return `
    <button class="remove-item" data-id="${item.Id}">✕</button>
      <li class="cart-card divider" data-id="${item.Id}">
        
        

        <a href="#" class="cart-card__image">
          <img src="${item.Image}" alt="${item.Name}" />
        </a>
        <a href="#">
          <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${item.Colors[0].ColorName}</p>

        <div class="qty-wrapper">
          <button class="qty-btn decrease" data-id="${item.Id}">−</button>

          <input 
            type="number" 
            min="1" 
            value="${item.quantity || 1}" 
            class="quantity-input" 
            data-id="${item.Id}"
          />

          <button class="qty-btn increase" data-id="${item.Id}">+</button>
        </div>

        <p class="cart-card__price">$${item.FinalPrice}</p>
      </li>
    `;
  }

  // -------------------------
  // REMOVE LISTENERS
  // -------------------------
  addRemoveListeners() {
    const removeBtns = document.querySelectorAll(".remove-item");

    removeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.removeItem(id);
      });
    });
  }

  // -------------------------
  // REMOVE ITEM
  // -------------------------
  removeItem(id) {
    let cart = getLocalStorage(this.key) || [];

    cart = cart.filter(item => item.Id != id);

    localStorage.setItem(this.key, JSON.stringify(cart));

    this.init(); // re-render
  }

  // -------------------------
  // QUANTITY LISTENERS
  // -------------------------
  addQuantityListeners() {
    const inputs = document.querySelectorAll(".quantity-input");
    const increaseBtns = document.querySelectorAll(".increase");
    const decreaseBtns = document.querySelectorAll(".decrease");

    inputs.forEach(input => {
      input.addEventListener("change", (e) => {
        const productId = e.target.dataset.id;
        let newQty = parseInt(e.target.value);
        if (newQty < 1) newQty = 1;

        this.updateQuantity(productId, newQty);
      });
    });

    increaseBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.changeQuantity(id, 1);
      });
    });

    decreaseBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.changeQuantity(id, -1);
      });
    });
  }

  // -------------------------
  // CHANGE QUANTITY BY +/- 1
  // -------------------------
  changeQuantity(id, delta) {
    let cart = getLocalStorage(this.key) || [];

    cart = cart.map(item => {
      if (item.Id == id) {
        const newQty = (item.quantity || 1) + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });

    localStorage.setItem(this.key, JSON.stringify(cart));
    this.init();
  }

  // -------------------------
  // CHANGE TO SPECIFIC QUANTITY
  // -------------------------
  updateQuantity(productId, newQty) {
    let cart = getLocalStorage(this.key) || [];

    cart = cart.map(item => {
      if (item.Id == productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    localStorage.setItem(this.key, JSON.stringify(cart));
    this.init();
  }

  // -------------------------
  // UPDATE TOTAL
  // -------------------------
  updateTotal() {
    const cartItems = getLocalStorage(this.key) || [];
    const footer = document.querySelector('.list-footer');
    const totalElement = document.querySelector('.list-total');

    if (cartItems.length === 0) {
      footer.classList.add('hide');
      return;
    }

    footer.classList.remove('hide');

    const total = cartItems.reduce((sum, item) => {
      return sum + (Number(item.FinalPrice) * (item.quantity || 1));
    }, 0);

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}