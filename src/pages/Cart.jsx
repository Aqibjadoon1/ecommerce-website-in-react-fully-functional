import { Minus, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  addToCart,
  decreaseQuantity,
  getCartSummary,
  removeFromCart
} from '../store/cartSlice';
import { formatCurrency, getEffectivePrice } from '../utils/format';

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const summary = useMemo(() => getCartSummary(cart), [cart]);

  if (!cart.items.length) {
    return (
      <div className="empty-state">
        <h1>Your cart is empty</h1>
        <p>Products you add will stay here across sessions.</p>
        <Link to="/products" className="primary-button">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section>
        <div className="section-head">
          <div>
            <span className="eyebrow">Cart</span>
            <h1>Shopping cart</h1>
          </div>
          <Link to="/products">Add more products</Link>
        </div>
        <div className="cart-lines">
          {cart.items.map((item) => (
            <article className="cart-line" key={item.id}>
              <img src={item.images?.[0]} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <span>{item.categoryLabel}</span>
                <strong>{formatCurrency(getEffectivePrice(item))}</strong>
              </div>
              <div className="quantity-stepper">
                <button type="button" onClick={() => dispatch(decreaseQuantity(item.id))}>
                  <Minus size={16} />
                </button>
                <strong>{item.cartQuantity}</strong>
                <button type="button" onClick={() => dispatch(addToCart(item))}>
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="remove-button"
                type="button"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                <Trash2 size={17} />
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="summary-card">
        <h2>Order summary</h2>
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(summary.subtotal)}</strong>
        </div>
        <div>
          <span>Shipping</span>
          <strong>{summary.shipping ? formatCurrency(summary.shipping) : 'Free'}</strong>
        </div>
        {summary.freeShippingRemaining > 0 && (
          <p>Add {formatCurrency(summary.freeShippingRemaining)} more for free delivery.</p>
        )}
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatCurrency(summary.total)}</strong>
        </div>
        <Link to="/checkout" className="primary-button">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
