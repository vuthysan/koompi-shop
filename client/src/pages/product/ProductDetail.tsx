import { Button, Image, Spinner } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { MainButton } from "@twa-dev/sdk/react";
import { Pagination } from "swiper/modules";
import { ProductType } from "../../types/product";
import axios from "axios";

export default function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();

  const { addToCart, getCartTotal, removeFromCart, cartItems } =
    useContext(CartContext);

  const [data, setData] = useState<ProductType | null>();

  // useEffect(() => {
  //   WebApp.op
  // })
  let queryData = JSON.stringify({
    query: `query($slug: String!) {
    storeProduct(slug: $slug) {
      brand
      createdAt
      currency
      desc
      detail
      id
      previews
      price
      title
      thumbnail
      slug
      rating
      tags {
        id
        titleEn
        titleKh
        logo
        createdAt
        updatedAt
      }
      variants {
        id
        label
        price
        preview
        option
        available
      }
    }
  }`,
    variables: { slug: params.id },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://backend.riverbase.org/graphql/public?store_id=65977008063b32aaf14813c2",
    headers: {
      "Content-Type": "application/json",
    },
    data: queryData,
  };

  useEffect(() => {
    axios
      .request(config)
      .then((response) => {
        setData(response.data.data.storeProduct);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // console.log("data", data);
  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <Spinner size="md" />
        <p className="mt-3 text-md text-primary">Loading</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          className="scale-110"
        >
          {data?.previews?.map((img) => {
            return (
              <SwiperSlide>
                <Image
                  radius="md"
                  className="object-cover overflow-hidden h-[240px] w-screen"
                  src={`https://ipfs.backend.riverbase.org/api/ipfs?hash=${img}`}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        <h2 className="text-xl font-bold mt-8">{data?.title}</h2>
        <div className=" px-2 py-1 rounded-md text-sm text-primary bg-primary-50 inline-block">
          <div className="flex">
            <svg
              className="h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 9H21L11 24V15H4L13 0V9ZM11 11V7.22063L7.53238 13H13V17.3944L17.263 11H11Z"></path>
            </svg>{" "}
            <div>Available in stock</div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-8">Description</h2>
        <p className="text-base opacity-50">{data?.desc}</p>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg p-3">
        <div className="grid grid-cols-5 justify-between items-center gap-10">
          <div className="col-span-2">
            <small>Price:</small>
            <div className="text-2xl font-black ">
              ${parseInt(data?.price).toLocaleString()}
            </div>
          </div>

          <div className="flex gap-4 justify-between items-center col-span-3">
            {cartItems.length > 0 ? (
              <>
                <Button
                  onClick={() =>
                    removeFromCart({
                      id: data?.id,
                      name: data?.title,
                      thumbnail: data?.thumbnail,
                      price: parseFloat(data?.price),
                    })
                  }
                  size="sm"
                  className="w-full"
                  radius="full"
                  color="primary"
                >
                  <svg
                    className="h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5 11V13H19V11H5Z"></path>
                  </svg>
                </Button>

                <div>
                  {cartItems.find((item) => item.id === data?.id)?.quantity}
                </div>
                <Button
                  onClick={() =>
                    addToCart({
                      id: data?.id,
                      thumbnail: data?.thumbnail,
                      name: data?.title,
                      price: parseFloat(data?.price),
                    })
                  }
                  size="sm"
                  className="w-full"
                  radius="full"
                  color="primary"
                >
                  <svg
                    className="h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                  </svg>
                </Button>
              </>
            ) : (
              <Button
                onClick={() =>
                  addToCart({
                    id: data?.id,
                    thumbnail: data?.thumbnail,
                    name: data?.title,
                    price: parseFloat(data?.price),
                  })
                }
                className="w-screen"
                radius="full"
                color="primary"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>

      {cartItems.length > 0 && (
        <MainButton
          color="#2ed573"
          text={`VIEW ORDER  ${getCartTotal()?.toLocaleString()}`}
          onClick={() => {
            // WebApp.showAlert("Pay success");
            navigate("/checkout");
          }}
        />
      )}
    </>
  );
}