import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";

const dataSource = new ProductData(category);
const listElement = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, listElement);
productList.init();

const titleElement = document.querySelector("#category-title");

if (category) {
  titleElement.textContent =
    `Top Products: ${category.replace("-", " ").toUpperCase()}`;
}

const formatted =
  category.charAt(0).toUpperCase() +
  category.slice(1).replace("-", " ");

titleElement.textContent = `Top Products: ${formatted}`;