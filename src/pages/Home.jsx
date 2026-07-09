import { ArrowRight, BadgeCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingGrid from '../components/LoadingGrid';
import ProductCard from '../components/ProductCard';
import TrustStrip from '../components/TrustStrip';
import { getFallbackCategories, getProducts } from '../services/catalogService';
import { brandConfig } from '../config/brand';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const allCategories = getFallbackCategories();

  useEffect(() => {
    let mounted = true;
    getProducts().then((items) => {
      if (mounted) {
        setProducts(items);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const featured = products.slice(0, 12);
  const tvProducts = products.filter((product) => product.category === 'led-tv').slice(0, 8);

  const categories = allCategories;

  return (
    <div className="page-stack">
      <section className="store-hero">
        <img src="/1.png" alt="Product showcase" />
      </section>

      <TrustStrip />

      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="eyebrow">Shop by category</span>
            <h2>Find the right shelf fast</h2>
          </div>
          <Link to="/products">View all</Link>
        </div>
        <div className="category-grid">
          {categories.slice(0, 14).map((category) => (
            <Link
              to={`/products?category=${category.id}`}
              className="category-tile"
              key={category.id}
            >
              <img src={category.image} alt="" />
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="eyebrow">Latest products</span>
            <h2>New arrivals</h2>
          </div>
          <Link to="/products">View all products</Link>
        </div>
        {loading ? (
          <LoadingGrid />
        ) : (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <span className="eyebrow">LED TV</span>
            <h2>Smart TVs and entertainment</h2>
          </div>
          <Link to="/products?category=led-tv">View TVs</Link>
        </div>
        <div className="product-grid">
          {tvProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
