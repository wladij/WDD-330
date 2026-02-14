import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
const formData = new FormData(formElement);
const data = {};
formData.forEach((value, key) => {
data[key] = value;
});
return data;
}

export default class CheckoutProcess {
constructor(key, outputSelector) {
this.key = key;
this.outputSelector = outputSelector;
this.list = [];
this.itemTotal = 0;
this.shipping = 0;
this.tax = 0;
this.orderTotal = 0;
this.services = new ExternalServices();
}

init() {
this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
}

    calculateItemSubTotal() {
    const itemCount = this.list.length;
const subtotal = this.list.reduce((sum, item) => {
    return sum + item.FinalPrice;
}, 0);
        
        this.itemTotal = subtotal;

document.querySelector("#subtotal").innerText =
    `$${this.itemTotal.toFixed(2)}`;



}

calculateOrderTotal() {
    const itemCount = this.list.length;
    
this.tax = this.itemTotal * 0.06;
this.shipping = 10 + (itemCount - 1) * 2;
this.orderTotal = this.itemTotal + this.tax + this.shipping;

this.displayOrderTotals();


}

displayOrderTotals() {
  document.querySelector("#tax").innerText =
    `$${this.tax.toFixed(2)}`;

  document.querySelector("#shipping").innerText =
    `$${this.shipping.toFixed(2)}`;

  document.querySelector("#orderTotal").innerText =
    `$${this.orderTotal.toFixed(2)}`;
}

packageItems(items) {
return items.map(item => ({
id: item.Id,
name: item.Name,
price: item.FinalPrice,
quantity: item.quantity
}));
}

async checkout(form) {
  try {
    const formData = new FormData(form);
    const orderData = Object.fromEntries(formData.entries());

    orderData.orderDate = new Date().toISOString();
    orderData.orderTotal = this.orderTotal;
    orderData.tax = this.tax;
    orderData.shipping = this.shipping;
    orderData.items = this.packageItems(this.list);

    console.log("Sending order 👉", orderData);

    const result = await this.services.checkout(orderData);

    console.log("Success 👉", result);

    // limpiar carrito
    localStorage.removeItem(this.key);

    // ir a página de éxito
    window.location.href = "/checkout/success.html";

  } catch (err) {
    console.log("Checkout error 👉", err);
    alertMessage(err.message.message);
  }
}
}