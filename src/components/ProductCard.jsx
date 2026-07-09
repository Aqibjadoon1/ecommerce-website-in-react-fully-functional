import { Heart, ShoppingCart, Star, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';
import { formatCurrency, getDisplayPrice, getEffectivePrice } from '../utils/format';
import { selectIsWishlisted, toggleWishlist } from '../store/wishlistSlice';
import { brandConfig } from '../config/brand';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state) => selectIsWishlisted(state, product.id));
  const hasDiscount = product.discountPrice && product.discountPrice < (product.regularPrice || product.price);
  const canPurchase = product.purchasable !== false && product.inStock !== false && getEffectivePrice(product) > 0;

  const handleAction = (event) => {
    event.preventDefault();
    if (canPurchase) {
      dispatch(addToCart(product));
    } else {
      const phoneNumber = product.priceText?.match(/[\d-]{7,15}/)?.[0]?.replace(/-/g, '') || brandConfig.phone.replace(/[\s-]/g, '');
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-wrap">
        <button className="wishlist-button" type="button" aria-label={`Add ${product.name} to wishlist`} onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist(product.id)); }}>
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.categoryLabel}</span>
        <h3>{product.name}</h3>
        <div className="rating-line">
          <Star size={15} fill="currentColor" />
          <span>{product.rating || 0}</span>
          <span>({product.reviewCount || 0})</span>
        </div>
        <div className="price-row">
          <div>
            <strong>{getDisplayPrice(product)}</strong>
            {hasDiscount && <span>{formatCurrency(product.regularPrice || product.price)}</span>}
          </div>
          <button className="add-button" onClick={handleAction} type="button">
            {canPurchase ? <ShoppingCart size={17} /> : <Phone size={17} />}
            {canPurchase ? 'Add' : 'Call'}
          </button>
        </div>
      </div>
    </Link>
  );
}
