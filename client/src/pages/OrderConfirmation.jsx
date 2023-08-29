function OrderConfirmation() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);

  return (
    <div className="container mx-auto mt-10 p-10">
      <h1 className="text-4xl mb-10">Order Confirmation</h1>
      <div className="border p-5 mb-5">
        <h2 className="text-xl mb-5">Order Summary</h2>
        {cartItems.map(cartItem => (
          <div key={cartItem._id} className="flex justify-between mb-5">
            <p className="text-gray-600">{cartItem.product.name} x {cartItem.quantity}</p>
            <p className="text-gray-600">${cartItem.quantity * cartItem.product.price}</p>
          </div>
        ))}
        <div className="flex justify-between">
          <p className="text-xl">Total Price</p>
          <p className="text-xl">${totalPrice}</p>
        </div>
      </div>
      <div className="border p-5 mb-5">
        <h2 className="text-xl mb-5">Thank You For Your Purchase!</h2>
        <p className="text-gray-600 mb-5">Your order number is #123456789</p>
        <p className="text-gray-600">You will receive a confirmation email shortly.</p>
      </div>
      <button className="bg-blue-500 text-white p-5 w-full text-xl" onClick={() => window.location.href = '/'}>Continue Shopping</button>
    </div>
  );
}

export default OrderConfirmation;
