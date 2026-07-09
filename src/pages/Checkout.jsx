import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../services/catalogService';
import { clearCart, getCartSummary } from '../store/cartSlice';
import { formatCurrency, getEffectivePrice } from '../utils/format';

const initialAddress = {
  name: '',
  phone: '',
  address: '',
  city: ''
};

export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const summary = useMemo(() => getCartSummary(cart), [cart]);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();

  const updateAddress = (event) => {
    setAddress({ ...address, [event.target.name]: event.target.value });
  };

  const validateAddress = () =>
    address.name.trim() && address.phone.trim() && address.address.trim() && address.city.trim();

  const continueToPayment = () => {
    if (!validateAddress()) {
      setError('Please fill name, phone, address, and city before continuing.');
      return;
    }
    setError('');
    setStep(2);
  };

  const placeOrder = async () => {
    if (!cart.items.length) {
      setError('Your cart is empty.');
      return;
    }

    const savedOrder = await createOrder({
      customer: address,
      paymentMethod,
      items: cart.items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.cartQuantity,
        price: getEffectivePrice(item)
      })),
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      total: summary.total
    });

    setOrder(savedOrder);
    dispatch(clearCart());
  };

  if (order) {
    return (
      <div className="confirmation">
        <CheckCircle2 size={52} />
        <h1>Order confirmed</h1>
        <p>Your order number is {order.id}. We saved it to Firestore, or local demo storage if Firebase keys are not configured.</p>
        <Link to="/" className="primary-button">
          Back to home
        </Link>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="empty-state">
        <h1>Checkout needs a cart</h1>
        <p>Add a product before starting checkout.</p>
        <Link to="/products" className="primary-button">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="checkout-card">
        <div className="stepper">
          <span className={step === 1 ? 'active' : ''}>1. Shipping</span>
          <span className={step === 2 ? 'active' : ''}>2. Payment & review</span>
        </div>

        {error && <p className="form-error">{error}</p>}

        {step === 1 ? (
          <div className="form-grid">
            <label>
              Full name
              <input name="name" value={address.name} onChange={updateAddress} />
            </label>
            <label>
              Phone number
              <input name="phone" value={address.phone} onChange={updateAddress} />
            </label>
            <label className="wide">
              Street address
              <input name="address" value={address.address} onChange={updateAddress} />
            </label>
            <label>
              City
              <input name="city" value={address.city} onChange={updateAddress} />
            </label>
            <button className="primary-button wide" type="button" onClick={continueToPayment}>
              Continue to payment
            </button>
          </div>
        ) : (
          <div className="payment-step">
            <fieldset>
              <legend>Payment method</legend>
              {['Cash on Delivery', 'JazzCash / Easypaisa', 'Card placeholder'].map((method) => (
                <label className="radio-card" key={method}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </fieldset>

            <div className="review-box">
              <h2>Final review</h2>
              {cart.items.map((item) => (
                <div key={item.id}>
                  <span>{item.name} x {item.cartQuantity}</span>
                  <strong>{formatCurrency(getEffectivePrice(item) * item.cartQuantity)}</strong>
                </div>
              ))}
            </div>

            <div className="checkout-actions">
              <button className="secondary-button" type="button" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="primary-button" type="button" onClick={placeOrder}>
                Confirm order
              </button>
            </div>
          </div>
        )}
      </section>

      <aside className="summary-card">
        <h2>Total due</h2>
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(summary.subtotal)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <strong>{summary.shipping ? formatCurrency(summary.shipping) : 'Free'}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatCurrency(summary.total)}</strong>
        </div>
      </aside>
    </div>
  );
}
