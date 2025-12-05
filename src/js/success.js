import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();


    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      document.getElementById("order-number").textContent = `Your order number is: ${orderId}`;
    }

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("order-details"));

  if (!data || !data.items) {
    console.warn("No order data found");
    return;
  }

  document.querySelector("#itemsCount").textContent = data.items.length;
  document.querySelector("#orderTotal").textContent = `$${data.orderTotal.toFixed(2)}`;
document.querySelector("#shipping").textContent = `$${data.shipping.toFixed(2)}`;
document.querySelector("#tax").textContent = `$${data.tax.toFixed(2)}`;
document.querySelector("#grandTotal").textContent = `$${data.grandTotal.toFixed(2)}`;
});