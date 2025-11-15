import { getLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(key, outputElement) {
    this.key = key;
    this.outputElement = outputElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];

    if (cartItems.length === 0) {
      this.outputElement.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    const htmlItems = cartItems.map((item) => this.cartItemTemplate(item));
    this.outputElement.innerHTML = htmlItems.join("");
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
}
