import { getLocalStorage, loadHeaderFooter  } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { alertMessage } from "./utils.mjs";



const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    //console.log(item);
    return {
      Id: item.Id,
      Price: item.FinalPrice,
      Name: item.Name,
      Quantity: 1,
    };
  });
  return simplifiedItems;
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
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        // calculate and display the total amount of the items in the cart, and the number of items.
        const summaryElement = document.querySelector(
            this.outputSelector + " #cartTotal"
        );
        const itemNumElement = document.querySelector(
            this.outputSelector + " #num-items"
        );
        itemNumElement.innerText = this.list.length;
        // calculate the total of all the items in the cart
        const amounts = this.list.map((item) => item.FinalPrice);
        this.itemTotal = amounts.reduce((sum, item) => sum + item);
        summaryElement.innerText = `$${this.itemTotal}`;;
    }

    calculateOrderTotal() {
        // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
        this.tax = (this.itemTotal * .06);
        this.shipping = 10 + (this.list.length - 1) * 2;
        this.orderTotal = (
            parseFloat(this.itemTotal) +
            parseFloat(this.tax) +
            parseFloat(this.shipping)
        )
        // display the totals.
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    async checkout() {
  const formElement = document.forms["checkout"];
  const order = formDataToJSON(formElement);

  // Campos permitidos por la API
  const payload = {
    fname: order.fname,
    lname: order.lname,
    street: order.street,
    city: order.city,
    state: order.state,
    zip: order.zip,
    orderDate: new Date().toISOString(),
    orderTotal: parseFloat(this.orderTotal.toFixed(2)),
    items: packageItems(this.list)
  };

        try {
      console.log("PAYLOAD SENT TO SERVER:", JSON.stringify(payload, null, 2));
    const response = await services.checkout(payload);
    console.log("ORDER SUCCESS:", response);
            
            let orderId = null;
    if (response && response.Result && response.Result.id) {
      orderId = response.Result.id;
    } else {
        console.error("No orderId returned from server:", response);
        
    }
            localStorage.removeItem(this.key);
            const orderData = {
            items: packageItems(this.list),
            orderTotal: this.orderTotal,
            shipping: this.shipping,
            tax: this.tax,
            grandTotal: this.orderTotal 
            };

localStorage.setItem("order-details", JSON.stringify(orderData));
    window.location.href = `/checkout/success.html?orderId=${orderId || "unknown"}`;

  } catch (err) {
    console.error("SERVER ERROR:", err.message);
    alert(
      "There was an error placing your order:\n\n" +
      JSON.stringify(err.message, null, 2)
    );
  }
}


}