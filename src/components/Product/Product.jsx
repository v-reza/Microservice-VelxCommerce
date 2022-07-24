import React, { useState, useEffect, useContext } from "react";
import "./product.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { axiosGet, axiosPost } from "../../helper/axiosHelper";
import { useFolder } from "../../helper/useFolder";
import { AuthContext } from "../../context/UserContext";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import { Skeleton } from "@mui/material";
import { Button } from "@mui/material";

const Product = ({ setNavbarRefresh }) => {
  const [productList, setProductList] = useState([]);
  const [productBestSeller, setProductBestSeller] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [isToast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const pageCount = 4;
  const [loadMore, setLoadMore] = useState(pageCount);

  const folder = useFolder();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const resProductList = await axiosGet("/product");
        setProductList(resProductList.data);
        const resProductBestseller = await axiosGet("/product/all/bestseller");
        setProductBestSeller(resProductBestseller.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, []);

  const buyNow = async (productId) => {
    try {
      setLoading(true);
      await axiosPost(`/users/addToCart/${productId}`, {
        userId: user._id,
      });

      if (!user.cart.includes(productId)) {
        dispatch({ type: "ADD_CART", payload: productId });
      }
      setLoading(false);
      setToast(true);
      setMessage("Success Add to cart ");
      setNavbarRefresh(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="boxSwiperContainer mt-5">
        <h1 className="productList text-3xl font-bold">Product Best Seller</h1>
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
          {productBestSeller && productBestSeller.length === 0
            ? new Array(6).fill(2).map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="boxContainer">
                    <div className="boxSlideImg">
                      <Skeleton
                        variant="rectangular"
                        width={500}
                        height={500}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : productBestSeller.map((p) => (
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
                        {!user.product.includes(p._id) ? (
                          <span
                            className="buyBtn"
                            onClick={() => buyNow(p._id)}
                          >
                            Add to cart
                          </span>
                        ) : (
                          ""
                        )}
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
        <h1 className="productList  text-3xl font-bold">Product List</h1>
        <div className="productListGrid">
          {productList &&
            productList.slice(0, loadMore).map((p) => (
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
                    {!user.product.includes(p._id) ? (
                      <span className="buyBtn" onClick={() => buyNow(p._id)}>
                        Add to cart
                      </span>
                    ) : (
                      ""
                    )}
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
        {loadMore < productList?.length && (
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