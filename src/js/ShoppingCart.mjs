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

  const htmlItems = cartItems.map((item) => this.cartItemTemplate(item));
  this.outputElement.innerHTML = htmlItems.join("");

  
    this.updateTotal();
    
}

  cartItemTemplate(item) {
    return `
      <li class="cart-card divider">
        <a href="#" class="cart-card__image">
          <img src="${item.Image}" alt="${item.Name}" />
        </a>
        <a href="#">
          <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${item.Colors[0].ColorName}</p>
        <p class="cart-card__quantity">qty: 1</p>
        <p class="cart-card__price">$${item.FinalPrice}</p>
      </li>
    `;
  }
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
    return sum + Number(item.FinalPrice);
  }, 0);

  
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}
  
}

