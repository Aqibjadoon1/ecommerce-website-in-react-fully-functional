import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingGrid from '../components/LoadingGrid';
import ProductCard from '../components/ProductCard';
import {
  getFallbackCategories,
  getProducts,
  searchProducts
} from '../services/catalogService';
import { getEffectivePrice } from '../utils/format';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = getFallbackCategories();

  const selectedCategory = searchParams.get('category') || 'all';
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'featured';
  const maxPrice = Number(searchParams.get('max') || 0);

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

  const filteredProducts = useMemo(() => {
    let next = searchProducts(query, products);

    if (selectedCategory !== 'all') {
      next = next.filter((product) => product.category === selectedCategory);
    }

    if (maxPrice > 0) {
      next = next.filter((product) => getEffectivePrice(product) > 0 && getEffectivePrice(product) <= maxPrice);
    }

    return [...next].sort((a, b) => {
      if (sort === 'price-low') return getEffectivePrice(a) - getEffectivePrice(b);
      if (sort === 'price-high') return getEffectivePrice(b) - getEffectivePrice(a);
      if (sort === 'rating') return b.rating - a.rating;
      return Number(Boolean(b.discountPrice)) - Number(Boolean(a.discountPrice));
    });
  }, [maxPrice, products, query, selectedCategory, sort]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="catalog-page">
      <aside className="filter-panel">
        <div className="filter-title">
          <SlidersHorizontal size={18} />
          <h2>Filters</h2>
        </div>

        <label>
          Category
          <select value={selectedCategory} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Max price
          <select value={maxPrice || 'all'} onChange={(event) => updateFilter('max', event.target.value)}>
            <option value="all">Any price</option>
            <option value="25000">Under Rs. 25,000</option>
            <option value="100000">Under Rs. 100,000</option>
            <option value="200000">Under Rs. 200,000</option>
            <option value="350000">Under Rs. 350,000</option>
          </select>
        </label>

        <div className="filter-note">
          <strong>Fast feedback</strong>
          <span>Filters update instantly and work with Firebase or demo catalog data.</span>
        </div>
      </aside>

      <section className="catalog-results">
        <div className="catalog-head">
          <div>
            <span className="eyebrow">Product catalog</span>
            <h1>{query ? `Search results for "${query}"` : 'Shop electronics'}</h1>
            <p>{filteredProducts.length} products found</p>
          </div>
          <label>
            Sort
            <select value={sort} onChange={(event) => updateFilter('sort', event.target.value)}>
              <option value="featured">Featured deals</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        {loading ? (
          <LoadingGrid />
        ) : filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try a broader search or remove a filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
