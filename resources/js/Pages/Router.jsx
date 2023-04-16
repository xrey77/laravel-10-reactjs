import React from "react";
import {
  Router,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
// import Layout from './components/layout/Layout';




export default function Routers() {
    return (
        <Routes>
            <Route path="/aboutus" element={<Aboutus />} />
        </Routes>
  );
}
