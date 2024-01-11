import { CartContext } from "../context/CartContext";
import { MainButton } from "@twa-dev/sdk/react";
import { useContext } from "react";

export default function Checkout() {
  const { cartItems, addToCart, removeFromCart, getCartTotal } =
    useContext(CartContext);

  return (
    <>
      <h1 className="text-lg font-bold mb-4">My Cart</h1>
      <div className="flex flex-col gap-2">
        {cartItems.map((item) => (
          <div className="flex" key={item.id}>
            <div className="flex gap-4 bg-white p-2 rounded-md shadow-sm w-full">
              <img
                src={`https://ipfs.backend.riverbase.org/api/ipfs?hash=${item.thumbnail}`}
                alt={item.name}
                className="rounded-md w-16 h-16"
              />
              <div className="flex gap-3 justify-center flex-col">
                <h1 className="text-md font-bold">{item.name}</h1>
                <div className="flex gap-2 justify-between">
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex gap-4">
                    <button
                      className="bg-slate-200 h-6 w-6 rounded-full"
                      onClick={() => {
                        addToCart(item);
                      }}
                    >
                      +
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      className="bg-slate-200 h-6 w-6 rounded-full"
                      onClick={() => {
                        const cartItem = cartItems.find(
                          (product) => product.id === item.id
                        );
                        if (cartItem?.quantity === 1) {
                          removeFromCart(item);
                        } else {
                          removeFromCart(item);
                        }
                      }}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white  rounded-md shadow-sm p-3 mt-8">
        {cartItems.length > 0 ? (
          <div className="flex flex-col justify-between ">
            <div className="text-md flex justify-between gap-2">
              <div className="opacity-50">Subtotal:</div>
              <div>
                <b>${getCartTotal().toLocaleString()}</b>
              </div>
            </div>
            <div className="text-md flex justify-between gap-2">
              <div className="opacity-50">Discount:</div>
              <div>
                <b>10%</b>
              </div>
            </div>

            <div className="border my-4 opacity-60 rounded-full"></div>

            <div className="text-md flex justify-between gap-2">
              <div className="opacity-50">Total:</div>
              <div>
                <b>${getCartTotal() * 0.9}</b>
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-bold">Your cart is empty</h1>
        )}
      </div>

      {cartItems.length > 0 && (
        <MainButton
          color="#2ed573"
          text={`Pay  ${getCartTotal()?.toLocaleString()}`}
          onClick={() => {
            // WebApp.showAlert("Pay success");
          }}
        />
      )}
    </>
  );
}