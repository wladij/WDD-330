import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // H2 = Category
  document.querySelector("h2").textContent =
    product.Category.Name;

  // H3 = Brand + Product Name
  document.querySelector("h3").textContent =
    `${product.Brand.Name} ${product.NameWithoutBrand}`;

  // Image
  const productImage = document.querySelector("#productImage");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  // Price (USD → EUR example, remove if unnecessary)
  const euroPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(product.FinalPrice) * 0.85);

  document.querySelector("#productPrice").textContent = euroPrice;

  // Color
  document.querySelector("#productColor").textContent =
    product.Colors?.[0]?.ColorName || "Color not available";

  // Description
  document.querySelector("#productDesc").innerHTML =
    product.DescriptionHtmlSimple;

  // Add to cart button
  document.querySelector("#addToCart").dataset.id = product.Id;
}