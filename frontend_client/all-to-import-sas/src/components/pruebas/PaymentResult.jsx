import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PagoAprobado from "../compra/PagoAprobado";
import PagoCancelado from "../compra/PagoCancelado";
import PagoPendiente from "../compra/PagoPendiente";

function PaymentResult() {
  const { status } = useParams();

  // useEffect(() => {
  //   if (status === "success") {
  //     localStorage.removeItem("carrito");
  //   }
  // }, [status]);

  const renderMessage = () => {
    switch (status) {
      case "success":
        return <PagoAprobado />;
      case "failure":
        return <PagoCancelado />;
      case "pending":
        return <PagoPendiente />;
      default:
        return <Heading>Estado desconocido.</Heading>;
    }
  };

  return <div>{renderMessage()}</div>;
}

export default PaymentResult;
