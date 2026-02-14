const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: "servicesError",
      message: jsonResponse
    };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  async getData(category) {
  const response = await fetch(`${baseURL}products/search/${category} `);
  const data = await convertToJson(response);
  return data.Result;
}
  async findProductById(id) {
     console.log("Fetching product with ID:", id);
  const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log("API response:", data);
  return data.Result;
  }
  async checkout(payload) {
const url = "https://wdd330-backend.onrender.com/checkout";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
};

const response = await fetch(url, options);
const data = await response.json();
return data;


}



 
}

