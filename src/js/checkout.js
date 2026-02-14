import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
loadHeaderFooter();


const checkout = new CheckoutProcess("so-cart", "#orderSummary");
checkout.init();

const zipInput = document.querySelector("#zip");
zipInput.addEventListener("change", () => {
checkout.calculateOrderTotal();
});

const form = document.querySelector("#checkoutForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkout.checkout(form);
});