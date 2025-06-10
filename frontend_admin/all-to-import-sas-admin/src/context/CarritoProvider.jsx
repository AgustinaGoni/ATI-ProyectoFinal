import { createContext, useReducer } from "react";
import { carritoReducer, estadoInicialCarrito } from "../reducers/carrito-reducer.js";

export const CarritoContext = createContext();

function useCartReducer (){
  const [state, dispatch] = useReducer(carritoReducer, estadoInicialCarrito);

  const agregarAlCarrito = (producto) => dispatch({
    type: 'AGREGAR_AL_CARRITO',
    payload: producto
  })

  const eliminarDelCarrito = (producto) => dispatch({
    type: 'ELIMINAR_DEL_CARRITO',
    payload: producto
  })

  const actualizarCantidadPorInput = (producto, cantidad) => dispatch({
    type: 'ACTUALIZAR_CANTIDAD_INPUT',
    payload: {producto, cantidad}
  })


  const actualizarCarrito = (producto) => dispatch({
    type: 'ACTUALIZAR_CARRITO',
    payload: producto
  })

  const aumentarCantidad = (producto) => dispatch({
    type: 'AUMENTAR_CANTIDAD',
    payload: producto
  })

  const disminuirCantidad = (producto) => dispatch({
    type: 'DISMINUIR_CANTIDAD',
    payload: producto
  })

  const limpiarCarrito = () => dispatch({
    type: 'LIMPIAR_CARRITO'
  }) 

  return {state, agregarAlCarrito, eliminarDelCarrito, actualizarCantidadPorInput, actualizarCarrito, aumentarCantidad, disminuirCantidad, limpiarCarrito}
}

export function CarritoProvider({ children }) {

const {state, agregarAlCarrito, eliminarDelCarrito, actualizarCantidadPorInput ,actualizarCarrito, aumentarCantidad, disminuirCantidad, limpiarCarrito} = useCartReducer()

  return (
    <CarritoContext.Provider
      value={{
        carrito: state,
        agregarAlCarrito,
        limpiarCarrito,
        actualizarCarrito,
        eliminarDelCarrito,
        actualizarCantidadPorInput,
        aumentarCantidad,
        disminuirCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
