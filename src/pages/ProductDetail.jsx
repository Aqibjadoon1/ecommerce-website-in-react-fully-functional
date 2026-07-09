import { ArrowLeft, Check, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { getProductById } from '../services/catalogService';
import { formatCurrency, getDisplayPrice, getEffectivePrice } from '../utils/format';

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    getProductById(productId).then((item) => {
      if (mounted) setProduct(item);
    });
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (!product) {
    return (
      <div className="empty-state">
        <h1>Product not found</h1>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  const canPurchase = product.purchasable !== false && product.inStock !== false && getEffectivePrice(product) > 0;

  const addMany = () => {
    if (!canPurchase) return;
    Array.from({ length: quantity }).forEach(() => dispatch(addToCart(product)));
  };

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">
        <ArrowLeft size={18} />
        Back to products
      </Link>
      <section className="detail-grid">
        <div className="detail-gallery">
          <img src={product.images?.[0]} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="product-category">{product.categoryLabel}</span>
          <h1>{product.name}</h1>
          <div className="rating-line">
            <Star size={16} fill="currentColor" />
            <strong>{product.rating}</strong>
            <span>{product.reviewCount} reviews</span>
          </div>
          <div className="detail-price">
            <strong>{getDisplayPrice(product)}</strong>
            {product.discountPrice && <span>{formatCurrency(product.regularPrice || product.price)}</span>}
          </div>
          <p>{product.description}</p>

          <div className="stock-line">
            <Check size={18} />
            {product.stock > 10 ? 'In stock' : product.stock > 0 ? 'Low stock' : 'Out of stock'}
          </div>

          <div className="quantity-row">
            <span>Quantity</span>
            <div className="quantity-stepper">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={16} />
              </button>
              <strong>{quantity}</strong>
              <button type="button" onClick={() => setQuantity(quantity + 1)}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="primary-button" onClick={addMany} type="button" disabled={!canPurchase}>
              {canPurchase ? 'Add to cart' : 'Call for availability'}
            </button>
            <Link className="secondary-button" to="/checkout" onClick={addMany}>
              Buy now
            </Link>
          </div>

          <div className="policy-list">
            <div>
              <Truck size={20} />
              <span>Delivery estimate: 2-4 business days</span>
            </div>
            <div>
              <ShieldCheck size={20} />
              <span>Brand warranty and 7-day return support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="spec-section">
        <div>
          <span className="eyebrow">Key specifications</span>
          <h2>Scannable details</h2>
        </div>
        <dl className="spec-grid">
          {Object.entries(product.specs || {}).map(([key, value]) => (
            <div key={key}>
              <dt>{key.replace(/([A-Z])/g, ' $1')}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
