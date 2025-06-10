import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../js/config";

const productos = [
  {
    id: 1,
    title: "Producto 1",
    description: "Descripción del Producto 1",
    price: 100,
    quantity: 1,
  },
  {
    id: 2,
    title: "Producto 2",
    description: "Descripción del Producto 2",
    price: 150,
    quantity: 2,
  },
  {
    id: 3,
    title: "Producto 3",
    description: "Descripción del Producto 3",
    price: 80,
    quantity: 3,
  },
];

//export default productos;

const unirProductos = () => {
  return productos.map((p) => `${p.title} x ${p.quantity}`).join(" | ");
};

function Checkout() {
  const publicKey = "APP_USR-a85ea354-c55e-4478-93ab-8cc1e1cedb6c";

  useEffect(() => {
    initMercadoPago(publicKey);
  }, [publicKey]);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preferenceId, setPreferenceId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      // "https://localhost:7232/MercadoPago2/create_preference",
      `${API_URL}MercadoPago2/create_preference`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${description} x ${ parseInt(quantity, 10)}`,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
        }),
      }
    );
    const data = await response.json();
    setPreferenceId(data.responseBody.id);
  };

  return (
    <div>
      <h1>Mercado Pago Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Create Preference</button>
      </form>
      {preferenceId && <Wallet initialization={{ preferenceId }} />}
    </div>
  );
}

export default Checkout;