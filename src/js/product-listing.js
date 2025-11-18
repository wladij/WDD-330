import ProductData from "./ProductData.mjs";
import ProductList from "/js/ProductList.mjs";
import { loadHeaderFooter, getParam } from "/js/utils.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";

//document.querySelector("#category-title").innerText = category.toUpperCase();
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");


const list = new ProductList(category, dataSource, listElement);
list.init();