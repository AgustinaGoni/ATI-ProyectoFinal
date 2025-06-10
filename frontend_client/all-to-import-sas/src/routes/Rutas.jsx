import React, { Fragment, lazy, Suspense } from "react";
import { Outlet, Route } from "react-router-dom";
import Cargando from "../components/Cargando";


export const renderizarRutas = (rutas) => {
  return rutas.map((ruta, index) => {
    const Component = ruta.element || Fragment;
    const Layout = ruta.layout || Fragment;
    const RutaProtegida = ruta.protected || Fragment;
    return (
      <Route
        key={index}
        path={ruta.path}
        element={
          <Suspense fallback={<Cargando />}>
            <RutaProtegida>

                <Layout>{ruta.children ? <Outlet /> : <Component />}</Layout>

            </RutaProtegida>
          </Suspense>
        }
      >
        {ruta.children && renderizarRutas(ruta.children)}
      </Route>
    );
  });
};

export const rutas = [
  {
    layout: lazy(async () => await import("../components/layout/Layout")),
    children: [
      {
        path: "/",
        element: lazy(async () => await import("../components/layout/Home")),
      },
      {
        path: "/mi-carrito",
        element: lazy(async () => await import("../components/Carrito")),
      },
      {
        path: "/formas-envio",
        element: lazy(async () => await import("../components/pages/secciones/FormasDeEnvio")),
      },
      {
        path: "/contacto", 
        element: lazy(() => import("../components/pages/secciones/Contacto")), 
      },
      {
        path: "/como-comprar", 
        element: lazy(() => import("../components/pages/secciones/ComoComprar")), 
      },      {
        path: "/sobre-nosotros", 
        element: lazy(() => import("../components/pages/secciones/SobreNosotros")), 
      },
      {
        path: "/result/:status",
        element: lazy(
          async () => await import("../components/pruebas/PaymentResult")
        ),
        protected: lazy(async () => await import("./RutasProtegidas")),
      },
      {
        path: "/mi-cuenta",
        element: lazy(async () => await import("../components/MiCuenta")),
        protected: lazy(async () => await import("./RutasProtegidas")),
      },
      {
        path: "/mis-compras",
        element: lazy(
          async () => await import("../components/usuario/MisCompras")
        ),
        protected: lazy(async () => await import("./RutasProtegidas")),
      },
      {
        path: "detalle-pedido/:id",
        element: lazy(
          async () =>
            await import("../components/usuario/mis_compras/DetallePedido")
        ),
        protected: lazy(async () => await import("./RutasProtegidas")),
      },
      {
        path: "/mis-compras",
        element: lazy(
          async () => await import("../components/usuario/MisCompras")
        ),
        protected: lazy(async () => await import("./RutasProtegidas")),
      },
      {
        path: "/realizar-pedido",
        element: lazy(
          async () => await import("../components/compra/RealizarPedido")
        ),
        protected: lazy(async () => await import("./RutasProtegidas")),
      },
      {
        path: "/categoria/:categoriaNombre/:categoriaId",
        element: lazy(
          async () =>
            await import("../components/producto/ProductosPorCategoria")
        ),
      },
      {
        path: "/producto/:nombre/:id",
        element: lazy(
          async () => await import("../components/producto/DetalleProducto")
        ),
      },
      {
        path: "/productos",
        element: lazy(
          async () => await import("../components/producto/Productos")
        ),
      },
      {
        path: "/productos-menor-mil",
        element: lazy(
          async () => await import("../components/producto/ProductosMenorQueMil")
        ),
      },
    ],
  },

  {
    path: "*",
    element: lazy(async () => await import("../components/pages/NotFound")),
  },
];
