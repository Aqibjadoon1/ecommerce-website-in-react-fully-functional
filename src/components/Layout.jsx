import {
  Heart,
  LayoutGrid,
  Menu,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getCartSummary } from '../store/cartSlice';
import { categories } from '../data/umarCatalog';
import BrandLogo from './BrandLogo';
import { brandConfig } from '../config/brand';
import { ADMIN_EMAILS } from '../config/admin';

const baseNav = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/support/returns', label: 'FAQs' }
];

export default function Layout() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const navItems = user && ADMIN_EMAILS.includes(user.email)
    ? [...baseNav, { to: '/admin', label: 'Admin' }]
    : baseNav;
  const cart = useSelector((state) => state.cart);
  const summary = useMemo(() => getCartSummary(cart), [cart]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products');
    setMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <div className="header-left">
            <button
              className="icon-button mobile-only"
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <button
              className="cat-toggle"
              type="button"
              aria-label="Browse categories"
              onClick={() => setCatOpen(true)}
            >
              <LayoutGrid size={18} />
              <span className="mobile-only-inline">Categories</span>
            </button>
          </div>

          <Link to="/" className="brand" aria-label={`${brandConfig.name} home`}>
            <BrandLogo />
          </Link>

          <form className="search-form" onSubmit={submitSearch}>
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search AC, refrigerator, LED TV, appliances"
              aria-label="Search products"
            />
          </form>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

        </div>

        <form className="mobile-search" onSubmit={submitSearch}>
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search electronics"
            aria-label="Search products"
          />
        </form>
      </header>

      {catOpen && (
        <div className="cat-drawer-overlay" onClick={() => setCatOpen(false)}>
          <div className="cat-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cat-drawer-head">
              <h3>Categories</h3>
              <button className="icon-button" type="button" onClick={() => setCatOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="cat-drawer-body">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  onClick={() => setCatOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Navigation menu">
          <div className="mobile-menu-panel">
            <div className="mobile-menu-head">
              <BrandLogo />
              <button className="icon-button" type="button" onClick={() => setMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand footer-brand">
              <BrandLogo />
            </Link>
            <p>{brandConfig.tagline}. Browse a complete appliance catalog with clear product images, prices, cart, and checkout.</p>
          </div>
          <div>
            <h3>Shop</h3>
            {categories.slice(0, 5).map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`}>{category.name}</Link>
            ))}
          </div>
          <div>
            <h3>Customer Care</h3>
            <Link to="/support/shipping">Shipping</Link>
            <Link to="/support/returns">Returns & warranty</Link>
            <Link to="/support/contact">Contact</Link>
          </div>
          <div className="footer-trust">
            <ShieldCheck size={24} />
            <h3>Secure checkout</h3>
            <p>Cart, checkout, customer account, and Firebase order records are ready for your store.</p>
          </div>
        </div>
      </footer>

      <div className="float-actions">
        <Link className="float-btn" to="/account" aria-label="Account">
          <UserRound size={22} />
        </Link>
        <Link className="float-btn" to="/support/wishlist" aria-label="Wishlist">
          <Heart size={22} />
        </Link>
        <Link className="float-btn" to="/cart" aria-label="Cart">
          <ShoppingCart size={22} />
          {summary.itemCount > 0 && <span className="cart-count">{summary.itemCount}</span>}
        </Link>
      </div>
    </div>
  );
}
