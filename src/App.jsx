import { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/UserContext";
import Checkout from "./pages/Checkout/Checkout";
import Finish from "./pages/Finish/Finish";
import History from "./pages/History/History";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={user ? <Home /> : <Login />} />
          <Route
            path="/login"
            exact
            element={user ? <Navigate to="/" replace /> : <Login />}
            />
          <Route
            path="/checkout/cart"
            element={user ? <Checkout /> : <Navigate to="/" replace />}
          />
          <Route
            path="/checkout/finish"
            element={user ? <Finish /> : <Navigate to="/" replace />}
          />
          <Route
            path="/history"
            element={user ? <History /> : <Navigate to="/" replace />}
          />
          <Route 
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
