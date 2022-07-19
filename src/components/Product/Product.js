import React, { useContext, useEffect, useState } from "react";
import "./product.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import axios from "axios";
import { AuthContext } from "../../context/UserContext";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import { Button } from "@mui/material";

const Product = ({ folder, setParentRefresh }) => {
  const [product, setProduct] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [isToast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const pageCount = 4;
  const [loadMore, setLoadMore] = useState(pageCount);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get("/product");
      setProduct(res.data);
    };
    getProducts();
  }, []);

  const buyNow = async (productId) => {
    try {
      setLoading(true);
      await axios.post(`/users/addToCart/${productId}`, {
        userId: user._id,
      });

      if (!user.cart.includes(productId)) {
        dispatch({ type: "ADD_CART", payload: productId });
      }
      setLoading(false);
      setToast(true);
      setMessage("Success Add to cart ");
      setParentRefresh(true)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="boxSwiperContainer">
        <h1 className="productList">Best Seller</h1>
        <Swiper
          spaceBetween={10}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          // onSlideChange={() => console.log("slide change")}
          // onSwiper={(swiper) => console.log(swiper)}
          className="swiperContainer"
        >
          {product &&
            product.map((p) => (
              <SwiperSlide key={p._id}>
                <div className="boxContainer">
                  <div className="boxSlideImg">
                    <img
                      src={
                        p.product_image
                          ? folder + p.product_image
                          : folder + "/noProductImage.png"
                      }
                      alt=""
                    />
                    <div className="boxOverlay">
                      <span className="buyBtn" onClick={() => buyNow(p._id)}>
                        Beli Sekarang
                      </span>
                    </div>
                  </div>
                  <div className="detailBox">
                    <div className="type">
                      <span className="productName">{p.product_name}</span>
                      <span className="productDescription">
                        {p.product_category}
                      </span>
                    </div>
                    <span className="price">${p.product_price}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <h1 className="productList">Product List</h1>
        <div className="productListGrid">
          {product &&
            product.slice(0, loadMore).map((p) => (
              <div className="boxContainer" key={p._id}>
                <div className="boxSlideImg">
                  <img
                    src={
                      p.product_image
                        ? folder + p.product_image
                        : folder + "/noProductImage.png"
                    }
                    alt=""
                  />
                  <div className="boxOverlay">
                    <span className="buyBtn" onClick={() => buyNow(p._id)}>
                      Beli Sekarang
                    </span>
                  </div>
                </div>
                <div className="detailBox">
                  <div className="type">
                    <span className="productName">{p.product_name}</span>
                    <span className="productDescription">
                      {p.product_category}
                    </span>
                  </div>
                  <span className="price">${p.product_price}</span>
                </div>
              </div>
            ))}
        </div>
        {loadMore < product?.length && (
          <div className="btnLoadMore">
            <Button
              variant="contained"
              color="primary"
              size="large"
              // fullWidth
              onClick={() => setLoadMore(loadMore + pageCount)}
            >
              Load More
            </Button>
          </div>
        )}
        <Toast
          open={isToast}
          setOpen={setToast}
          message={message}
          variant="success"
        />
        <Loading open={loading} setOpen={setLoading} />
      </div>
    </>
  );
};

export default Product;
