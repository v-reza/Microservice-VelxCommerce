import { LinearProgress } from "@mui/material";
import React, { useContext, useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import PaymentGateway from "../../components/PaymentGateway/PaymentGateway";
import PersonalInformation from "../../components/PersonalInformation/PersonalInformation";
import ShippingAddress from "../../components/ShippingAddress/ShippingAddress";
import ShippingCost from "../../components/ShippingCost/ShippingCost";
import Summary from "../../components/Summary/Summary";
import { AuthContext } from "../../context/UserContext";
import Loading from "../../custom/Loading/Loading";
import Toast from "../../custom/Toast/Toast";
import { axiosGet } from "../../helper/axiosHelper";

const Checkout = ({ navbarRefresh, setNavbarRefresh }) => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);

  /* Summary */
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tax] = useState(3);
  const [priceShipping, setPriceShipping] = useState(0);

  /* Shipping Cost */
  const [city, setCity] = useState([]);
  const [chooseShipping, setChooseShipping] = useState([]);
  const navigate = useNavigate();

  /* Shipping Address */
  const [chooseShippingAddress, setChooseShippingAddress] = useState([]);

  /**
   * Get product for summary items
   */
  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchCart = await axiosGet(`/users/cart/${user._id}`);
        if (fetchCart.data.length === 0) {
          setError(true);
          setLoading(false);
          setToast(true);
          setMessage("Your cart is empty, you will be redirected to home page");
          setTimeout(() => {
            navigate("/");
          }, 4000);
          return;
        }
        setProducts(fetchCart.data);
      } catch (error) {
        setToast(true);
        setMessage("Something went wrong when fetch data");
        setError(true);
      }
    };
    getProducts();
    setRefresh(false);
  }, [user._id, navbarRefresh, refresh, navigate]);

  /**
   * Get Total Price for Summary
   */
  useEffect(() => {
    const getGrandTotal = async () => {
      const res = await axiosGet(`/users/cart/${user._id}`);
      let arrGrandTotal = [];
      res.data.map((grand) =>
        arrGrandTotal.push(
          parseInt(grand.cart[0].product_price) * parseInt(grand.qty)
        )
      );
      setGrandTotal(
        arrGrandTotal.reduce((a, b) => a + b, 0) +
          tax +
          parseFloat(priceShipping)
      );
      setTotalPrice(arrGrandTotal.reduce((a, b) => a + b, 0));
    };
    getGrandTotal();
  }, [user._id, tax, priceShipping]);

  /**
   * Get Kota Rajaongkir
   */
  useEffect(() => {
    const getCity = async () => {
      const res = await axiosGet("/rajaongkir/kota");
      setCity(
        res.data.rajaongkir.results.filter(
          (value, index, array) =>
            array.findIndex((v2) => v2.city_name === value.city_name) === index
        )
      );
    };
    getCity();
  }, []);

  return (
    <>
      <Suspense fallback={<LinearProgress />}>
        <section className="py-10 bg-gray-50">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
              <main className="md:w-2/3">
                <article className="border border-gray-200 bg-white shadow-sm rounded p-4 lg:p-6 mb-5">
                  {/* Personal Information */}
                  <PersonalInformation user={user} />
                  <hr className="my-4" />
                  {/* Shipping Cost */}
                  <ShippingCost
                    city={city}
                    setPriceShipping={setPriceShipping}
                    setChooseShipping={setChooseShipping}
                  />
                  <hr className="my-4" />
                  {/* Billing Address */}
                  <ShippingAddress
                    setToast={setToast}
                    setError={setError}
                    setMessage={setMessage}
                    setLoading={setLoading}
                    setChooseShippingAddress={setChooseShippingAddress}
                  />
                  <hr className="my-4" />
                  <PaymentGateway />
                </article>
              </main>
              <aside className="md:w-1/3">
                <Summary
                  totalPrice={totalPrice}
                  grandTotal={grandTotal}
                  tax={tax}
                  shipping={priceShipping}
                  chooseShipping={chooseShipping}
                  products={products}
                  chooseShippingAddress={chooseShippingAddress}
                />
              </aside>
            </div>
          </div>
        </section>
        <Footer />
      </Suspense>
      <Toast
        open={isToast}
        setOpen={setToast}
        message={message}
        variant={error ? "error" : "success"}
      />
      <Loading open={loading} setOpen={setLoading} />
    </>
  );
};

export default Checkout;
