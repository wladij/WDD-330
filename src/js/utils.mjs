// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (!templateFn || !parentElement || !Array.isArray(list)) {
    console.error("renderListWithTemplate: parámetros inválidos");
    return;
  }

  
  if (clear) {
    parentElement.innerHTML = "";
  }

  
  const htmlStrings = list.map(templateFn);

  
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}


export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  
  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // message + close button
  alert.innerHTML = `
    <p>${message}</p>
    <span class="close">&times;</span>
  `;

  // remove alert when clicking the X
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("close") || e.target.innerText === "×") {
      this.remove();
    }
  });

  // inject alert at top of <main>
  const main = document.querySelector("main");
  main.prepend(alert);

  // scroll to top if enabled
  if (scroll) window.scrollTo(0, 0);
}
