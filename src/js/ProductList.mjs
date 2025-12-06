import ProductData from "./ProductData.mjs";
import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

 
  const discountPercent = isDiscounted
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : 0;

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        
        <div class="product-image-wrapper">
          <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
          ${
            isDiscounted
              ? `<span class="discount-badge">-${discountPercent}%</span>`
              : ""
          }
        </div>

        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>

        <p class="product-card__price">
          $${product.FinalPrice.toFixed(2)}
          ${
            isDiscounted
              ? `<span class="old-price">$${product.SuggestedRetailPrice.toFixed(2)}</span>`
              : ""
          }
        </p>
      </a>
    </li>`;
}




export default class ProductList{
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
      this.renderList(list);
      document.querySelector(".title").textContent = this.category.toUpperCase();
    }

  renderList(list) {
    


   renderListWithTemplate(productCardTemplate, this.listElement, list);

  }
}
