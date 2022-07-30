import { Skeleton } from "@mui/material";
import React from "react";
import { useFolder } from "../../helper/useFolder";

const SummaryItems = ({ products }) => {
  const folder = useFolder();
  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Items in cart</h2>
      {products && products.length === 0
        ? new Array(6).fill(6).map((item, index) => (
            <React.Fragment key={index}>
              <figure className="flex items-center mb-4 leading-5">
                <div>
                  <div className="block relative w-20 h-70 rounded p-1 border border-gray-200">
                    <Skeleton variant="rectangular" width={70} height={70} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 text-sm text-center flex items-center justify-center text-white bg-gray-400 rounded-full">
                      {" "}
                    </span>
                  </div>
                </div>
                <figcaption className="ml-3">
                  <p>
                    <Skeleton variant="text" width={100} />
                  </p>
                  <p className="mt-1 text-gray-400">
                    <Skeleton variant="text" />
                  </p>
                </figcaption>
              </figure>
            </React.Fragment>
          ))
        : products.map((product) => (
            <figure className="flex items-center mb-4 leading-5" key={product._id}>
              <div>
                <div className="block relative w-20 h-70 rounded p-1 border border-gray-200">
                  <img
                    width={70}
                    height={70}
                    src={
                      product.cart[0].product_image
                        ? folder + product.cart[0].product_image
                        : folder + "/noProductImage.png"
                    }
                    alt="Title"
                  />
                  <span className="absolute -top-2 -right-2 w-6 h-6 text-sm text-center flex items-center justify-center text-white bg-gray-400 rounded-full">
                    {product.qty}
                  </span>
                </div>
              </div>
              <figcaption className="ml-3">
                <p> {product.cart[0].product_name}</p>
                {/* <p className="mt-1 text-gray-400">
                  Qty: 
                  {" " + product.qty}
                </p> */}
                <p className="mt-1 text-gray-400">
                  Total: $
                  {parseInt(product.cart[0].product_price) * product.qty}
                </p>
              </figcaption>
            </figure>
          ))}
    </>
  );
};

export default SummaryItems;
