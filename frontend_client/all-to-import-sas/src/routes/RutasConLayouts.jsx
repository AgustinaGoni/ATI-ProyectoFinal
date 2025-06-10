import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../pages/NotFound";

const RutasConLayouts = ({ routes }) => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <route.layout isAdmin={route.isAdmin}>
              {route.component}
            </route.layout>
          }
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RutasConLayouts;
