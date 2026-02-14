import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {

  let discountBadge = "";
  let originalPrice = "";

  if (product.FinalPrice < product.SuggestedRetailPrice) {

    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) * 100
    );

    discountBadge = `<span class="discount-badge">-${discount}%</span>`;

    originalPrice = `<p class="original-price">$${product.SuggestedRetailPrice}</p>`;
  }

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Name}</h3>

        ${discountBadge}

        ${originalPrice}
        <p class="final-price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}