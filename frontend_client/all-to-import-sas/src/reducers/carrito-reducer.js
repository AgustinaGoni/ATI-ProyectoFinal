// Función para obtener el carrito desde localStorage y verificar expiración
const obtenerCarritoDesdeLocalStorage = () => {
  const itemStr = window.localStorage.getItem("carrito");
  
  if (!itemStr) {
    return [];
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiration) {
    // Si ha expirado, eliminar el carrito del localStorage y retornar un carrito vacío
    window.localStorage.removeItem("carrito");
    return [];
  }

  return item.value;
};


export const estadoInicialCarrito = obtenerCarritoDesdeLocalStorage();

export const CARRITO_ACTION_TYPES = {
  AGREGAR_AL_CARRITO: "AGREGAR_AL_CARRITO",
  ELIMINAR_DEL_CARRITO: "ELIMINAR_DEL_CARRITO",
  ACTUALIZAR_CANTIDAD_INPUT: "ACTUALIZAR_CANTIDAD_INPUT",
  ACTUALIZAR_CARRITO: "ACTUALIZAR_CARRITO",
  AUMENTAR_CANTIDAD: "AUMENTAR_CANTIDAD",
  DISMINUIR_CANTIDAD: "DISMINUIR_CANTIDAD",
  LIMPIAR_CARRITO: "LIMPIAR_CARRITO",
};

//Actualizar el localStorage
// Función para guardar el carrito en localStorage con tiempo de expiración
export const actualizarLocalStorage = (state) => {
  // window.localStorage.setItem("carrito", JSON.stringify(state));
  const expirationInMinutes = 120; // Tiempo de expiración en minutos (por ejemplo, 24 horas)
  const now = new Date();
  
  const item = {
    value: state,
    expiration: now.getTime() + expirationInMinutes * 60 * 1000, // Tiempo en milisegundos
  };
  
  window.localStorage.setItem("carrito", JSON.stringify(item));
};


const MIN_ITEMS = 1;

export const carritoReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {

    case CARRITO_ACTION_TYPES.AGREGAR_AL_CARRITO: {
      const productoIndex = state.findIndex((item) => item.id === payload.id);

      if (productoIndex >= 0) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        const actualizarCarrito = structuredClone(state);
        actualizarCarrito[productoIndex].cantidad += payload.cantidad || 1; // Usa 1 como valor predeterminado si no se especifica cantidad
        actualizarLocalStorage(actualizarCarrito);
        return actualizarCarrito;
      }

      // Si el producto no está en el carrito, lo agregamos con la cantidad especificada o 1 por defecto
      const actualizarCarrito = [
        ...state,
        {
          ...payload,
          cantidad: payload.cantidad || 1, // Usa 1 como valor predeterminado si no se especifica cantidad
        },
      ];

      actualizarLocalStorage(actualizarCarrito);
      return actualizarCarrito;
    }


    case CARRITO_ACTION_TYPES.ELIMINAR_DEL_CARRITO: {
      const actualizarCarrito = state.filter((item) => item.id !== payload.id);
      actualizarLocalStorage(actualizarCarrito);
      return actualizarCarrito;
    }

    case CARRITO_ACTION_TYPES.ACTUALIZAR_CANTIDAD_INPUT: {
      const { producto, cantidad } = payload;
      const actualizarCarrito = state.map((item) => {
        if (item.id === producto.id) {
          return {
            ...item,
            cantidad: cantidad,
          };
        }
        return item;
      });
      actualizarLocalStorage(actualizarCarrito);
      return actualizarCarrito;
    }

    case CARRITO_ACTION_TYPES.ACTUALIZAR_CARRITO: {
      const actualizarCarrito = state.map((item) => {
        if (item.id === payload.id) {
          return {
            ...item,
            payload,
          };
        }
        return item;
      });

      actualizarLocalStorage(actualizarCarrito);
      return actualizarCarrito;
    }

    case CARRITO_ACTION_TYPES.AUMENTAR_CANTIDAD: {
      const actualizarCarrito = state.map((item) => {
        if (item.id === payload.id && item.cantidad < payload.stock) {
          return {
            ...item,
            cantidad: item.cantidad + 1,
          };
        }

        return item;
      });

      actualizarLocalStorage(actualizarCarrito);
      return actualizarCarrito;
    }

    case CARRITO_ACTION_TYPES.DISMINUIR_CANTIDAD: {
      const actualizarCarrito = state.map((item) => {
        if (item.id === payload.id && item.cantidad > MIN_ITEMS) {
          return {
            ...item,
            cantidad: item.cantidad - 1,
          };
        }

        return item;
      });

      actualizarLocalStorage(actualizarCarrito);
      return actualizarCarrito;
    }

    case CARRITO_ACTION_TYPES.LIMPIAR_CARRITO: {
      actualizarLocalStorage([]);
      return [];
    }
  }
  return state;
};
