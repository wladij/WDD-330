import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <img src="${item.Images.PrimaryMedium}" alt="${item.NameWithoutBrand}" />
      <h2>${item.NameWithoutBrand}</h2>
      <p>${item.Colors?.[0]?.ColorName || ""}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(listElement) {
    this.listElement = listElement;
    this.cartFooter = document.querySelector(".cart-footer");
    this.cartTotal = document.querySelector(".cart-total");
  }

  init() {
    const cartItems = getLocalStorage("so-cart") || [];

    if (!cartItems.length) {
      this.listElement.innerHTML = `
        <li class="cart-card divider">
          <p>Your cart is empty</p>
        </li>
      `;
      return;
    }

    this.renderCart(cartItems);
    this.renderTotal(cartItems);
  }

  renderCart(cartItems) {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      cartItems,
      "afterbegin",
      true
    );
  }

  renderTotal(cartItems) {
    const total = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice,
      0
    );

    this.cartFooter.classList.remove("hide");
    this.cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
  }
}
