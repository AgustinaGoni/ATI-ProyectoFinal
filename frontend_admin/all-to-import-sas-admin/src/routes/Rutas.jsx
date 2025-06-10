import React, { Fragment, lazy, Suspense } from "react";
import { Outlet, Route } from "react-router-dom";
import { PATH_LOGIN } from "./paths";
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
    path: PATH_LOGIN,
    element: lazy(async () => await import("../components/pages/Login")),
  },
  {
    path: "/panel-admin",
    layout: lazy(async () => await import("../components/layout/Dashboard")),
    protected: lazy(async () => await import("./RutasProtegidas")),
    children: [
      {
        path: "inicio",
        element: lazy(async () => await import("../components/pages/Inicio")),
      },
      {
        path: "productos",
        children: [
          {
            path: "",
            element: lazy(
              async () =>
                await import("../components/pages/productos/PaginatedProducts")
            ),
          },
          {
            path: "editar-producto/:id/:nombre",
            element: lazy(
              async () =>
                await import("../components/pages/productos/EditarProducto")
            ),
          },
        ],
      },
      {
        path: "categorias",
        children: [
          {
            path: "",
            element: lazy(
              async () =>
                await import("../components/pages/categorias/Categorias")
            ),
          },
          {
            path: "agregar-categoria",
            element: lazy(
              async () =>
                await import("../components/pages/categorias/AgregarCategoria")
            ),
          },
          {
            path: "editar-categoria/:id",
            element: lazy(
              async () =>
                await import("../components/pages/categorias/ModificarCategoria")
            ),
          },
        ],
      },
      {
        path: "ventas",
        children: [
          {
            path: "",
            element: lazy(
              async () => await import("../components/pages/ventas/Ventas")
            ),
          },
          {
            path: "ventas-estado/:nombre/:estado",
            element: lazy(
              async () =>
                await import("../components/wrappers/VentasPorStadoWrapper")
            ),
          },
          {
            path: "detalle-venta/:id",
            element: lazy(
              async () =>
                await import("../components/pages/ventas/DetalleVenta")
            ),
          },
        ],
      },
      {
        path: "configuracion",
        children: [
          {
            path: "",
            element: lazy(
              async () =>
                await import(
                  "../components/pages/configuraciones/Configuracion"
                )
            ),
          },
          {
            path: "agregar-direccion-retiro",
            element: lazy(
              async () =>
                await import(
                  "../components/pages/configuraciones/AgregarDatosRetiro"
                )
            ),
          },
          {
            path: "ver-direcciones-retiro",
            element: lazy(
              async () =>
                await import(
                  "../components/pages/configuraciones/LugaresDeRetiro"
                )
            ),
          },
          {
            path: "modificar-direcciones-retiro/:id",
            element: lazy(
              async () =>
                await import(
                  "../components/pages/configuraciones/ModificarDatosReitro"
                )
            ),
          },
          {
            path: "registrar-funcionario",
            element: lazy(
              async () =>
                await import(
                  "../components/pages/configuraciones/funcionarios/RegistrarFuncionario"
                )
            ),
          },
          {
            path: "funcionarios",
            children: [
              {
                path: "",
                element: lazy(
                  async () =>
                    await import(
                      "../components/pages/configuraciones/funcionarios/Funcionarios"
                    )
                ),
              },
              {
                path: "modificar-funcionario/:nombre/:id",
                element: lazy(
                  async () =>
                    await import(
                      "../components/pages/configuraciones/funcionarios/ModificarFuncionario"
                    )
                ),
              },
            ],
          },
        ],
      },
      {
        path: "reportes",
        element: lazy(
          async () =>
            await import(
              "../components/pages/reportes/Reportes"
            )
        ),
      },
    ],
  },
  {
    path: "*",
    element: lazy(async () => await import("../components/pages/NotFound")),
  },
];
