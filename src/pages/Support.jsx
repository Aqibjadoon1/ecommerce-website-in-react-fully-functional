import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getFallbackProducts } from '../services/catalogService';

const content = {
  shipping: {
    title: 'Shipping policy',
    body: 'Free delivery applies above Rs. 5,000. Standard delivery estimates are 2-4 business days and should be shown before order confirmation.'
  },
  returns: {
    title: 'Returns & warranty',
    body: 'Products include visible warranty details. Returns are simple, customer-friendly, and clearly summarized on product and checkout pages.'
  },
  contact: {
    title: 'Contact us',
    body: 'Customer support can be connected to a Firebase contact collection or a helpdesk later. For now, this page documents the support route.'
  }
};

export default function Support() {
  const { topic } = useParams();
  const wishlistIds = useSelector((state) => state.wishlist.items);
  const allProducts = getFallbackProducts();

  if (topic === 'wishlist') {
    const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));
    return (
      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="eyebrow">Saved items</span>
            <h2>Your Wishlist</h2>
          </div>
        </div>
        {wishlistProducts.length === 0 ? (
          <div className="empty-state">
            <Heart size={48} strokeWidth={1.5} />
            <h3>Your wishlist is empty</h3>
            <p>Tap the heart icon on any product to save it here.</p>
            <Link to="/products" className="primary-button">Browse products</Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    );
  }

  const page = content[topic] || content.contact;

  return (
    <div className="support-page">
      <section className="support-card">
        <span className="eyebrow">Customer service</span>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
        <Link to="/products" className="primary-button">Continue shopping</Link>
      </section>
    </div>
  );
}
