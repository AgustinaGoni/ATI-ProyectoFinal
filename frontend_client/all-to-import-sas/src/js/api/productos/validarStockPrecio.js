export const validarStockPrecio = (stock, precio) => {
  if (stock < 1 || precio < 1) {
    return false;
  }

  return true;
};
