import { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomeSection from "./components/HomeSection/HomeSection";
import Navbar from "./components/Navbar/Navbar";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import { AuthContext } from "./context/UserContext";
import Checkout from "./pages/Checkout/Checkout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Finish from "./pages/Finish/Finish";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Notfound from "./pages/Notfound/404";
import Register from "./pages/Register/Register";
import Transaction from "./pages/Transaction/Transaction";

function App() {
  const { user } = useContext(AuthContext);
  const [navbarRefresh, setNavbarRefresh] = useState(false);
  const [isNotfound, setIsNotfound] = useState(false);
  console.log(navbarRefresh);

  return (
    <>
      <Router>
        {user ? (
          !isNotfound ? (
            <Navbar
              navbarRefresh={navbarRefresh}
              setNavbarRefresh={setNavbarRefresh}
            />
          ) : (
            ""
          )
        ) : !isNotfound ? (
          <HomeSection />
        ) : (
          ""
        )}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Dashboard
                  navbarRefresh={navbarRefresh}
                  setNavbarRefresh={setNavbarRefresh}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard
                  navbarRefresh={navbarRefresh}
                  setNavbarRefresh={setNavbarRefresh}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/login"
            exact
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/checkout"
            element={
              user ? (
                <Checkout
                  navbarRefresh={navbarRefresh}
                  setNavbarRefresh={setNavbarRefresh}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/transaction"
            element={user ? <Transaction /> : <Navigate to="/" replace />}
          />
          <Route
            path="/checkout/finish"
            element={user ? <Finish /> : <Navigate to="/" replace />}
          />
          <Route
            path="/detail/product/:id"
            element={
              user ? (
                <ProductDetail
                  navbarRefresh={navbarRefresh}
                  setNavbarRefresh={setNavbarRefresh}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/404"
            element={<Notfound setIsNotfound={setIsNotfound} />}
          />
          <Route
            path="*"
            element={<Notfound setIsNotfound={setIsNotfound} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
