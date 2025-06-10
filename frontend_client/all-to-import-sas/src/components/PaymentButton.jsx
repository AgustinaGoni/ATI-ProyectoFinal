// import React, { useEffect, useState } from "react";
// import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
// import { API_URL } from "../js/config";

// const PaymentButton = ({ datosProductosMercadoPago }) => {
//   const publicKey = "APP_USR-a85ea354-c55e-4478-93ab-8cc1e1cedb6c";
//   useEffect(() => {
//     initMercadoPago(publicKey);
//   }, [publicKey]);
//   const [preferenceId, setPreferenceId] = useState(null);

//   //console.log(datosProductosMercadoPago);
//   const handlePayment = async () => {
//     try {
//       const response = await fetch(
//         // "https://alltoimportapi.azurewebsites.net/mercadopago/create_preference",
//         // "https://localhost:7079/MercadoPago/create_preference",
//         `${API_URL}MercadoPago/create_preference`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(datosProductosMercadoPago),

//         }
//       );
//       const data = await response.json();
//       console.log(data);
//       setPreferenceId(data.res.id);

//       if (response.ok) {
//         console.log("El pago a se realizo con exito");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <>
//       <button onClick={handlePayment}>Pagar con MercadoPago</button>
//       <br />
//       {preferenceId && <Wallet initialization={{ preferenceId }} />}
//     </>
//   );
// };

// export default PaymentButton;
