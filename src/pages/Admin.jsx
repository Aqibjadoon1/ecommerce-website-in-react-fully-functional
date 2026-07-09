import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFallbackCategories, getProducts, saveProduct } from '../services/catalogService';
import { formatCurrency } from '../utils/format';

const emptyProduct = {
  id: '',
  name: '',
  brand: '',
  category: 'air-conditioner',
  categoryLabel: 'Air Conditioner',
  price: '',
  discountPrice: '',
  stock: '',
  rating: '4.5',
  reviewCount: '0',
  description: '',
  images: ['https://umarelectronics.pk/wp-content/uploads/2026/05/AC.webp'],
  specs: {}
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState('');
  const categories = getFallbackCategories();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    if (name === 'category') {
      const category = categories.find((item) => item.id === value);
      setForm({ ...form, category: value, categoryLabel: category?.name || value });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const submit = async (event) => {
    event.preventDefault();
    const id = form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const saved = await saveProduct({ ...form, id, slug: id });
    setProducts([saved, ...products.filter((product) => product.id !== saved.id)]);
    setForm(emptyProduct);
    setMessage('Product saved. It writes to Firestore when Firebase keys are configured, otherwise local demo storage.');
  };

  return (
    <div className="admin-page">
      <section className="checkout-card">
        <span className="eyebrow">Admin panel</span>
        <h1>Product management</h1>
        <p>Add or update catalog products. This mirrors the admin route from the Gemini brief, adapted for Firebase.</p>

        <form className="form-grid" onSubmit={submit}>
          <label>
            Product name
            <input name="name" value={form.name} onChange={update} required />
          </label>
          <label>
            Brand
            <input name="brand" value={form.brand} onChange={update} required />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={update}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label>
            Price
            <input name="price" type="number" value={form.price} onChange={update} required />
          </label>
          <label>
            Discount price
            <input name="discountPrice" type="number" value={form.discountPrice} onChange={update} />
          </label>
          <label>
            Stock
            <input name="stock" type="number" value={form.stock} onChange={update} required />
          </label>
          <label className="wide">
            Image URL
            <input name="images" value={form.images?.[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
          </label>
          <label className="wide">
            Description
            <textarea name="description" value={form.description} onChange={update} rows="4" required />
          </label>
          <button className="primary-button wide" type="submit">
            <Save size={18} />
            Save product
          </button>
        </form>
        {message && <p className="form-note">{message}</p>}
      </section>

      <section className="admin-list">
        <h2>Catalog snapshot</h2>
        {products.slice(0, 8).map((product) => (
          <article key={product.id}>
            <img src={product.images?.[0]} alt="" />
            <div>
              <strong>{product.name}</strong>
              <span>{product.brand} · {product.categoryLabel}</span>
            </div>
            <b>{formatCurrency(product.discountPrice || product.price)}</b>
          </article>
        ))}
      </section>
    </div>
  );
}
