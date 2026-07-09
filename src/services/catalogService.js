import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { categories, demoProducts } from '../data/umarCatalog';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function getFallbackProducts() {
  const demo = clone(demoProducts);
  try {
    const local = JSON.parse(localStorage.getItem('demoAdminProducts') || '[]');
    if (local.length) {
      const existingIds = new Set(demo.map((p) => p.id));
      for (const product of local) {
        const idx = demo.findIndex((p) => p.id === product.id);
        if (idx >= 0) demo[idx] = product;
        else demo.push(product);
      }
    }
  } catch {}
  return demo;
}

export function getFallbackCategories() {
  return clone(categories);
}

export function searchProducts(term, products) {
  const needle = term.trim().toLowerCase();
  if (!needle) return products;

  return products.filter((product) =>
    [product.name, product.brand, product.categoryLabel, product.category]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  );
}

export async function getProducts() {
  if (!isFirebaseConfigured || !db) return getFallbackProducts();

  try {
    const snapshot = await getDocs(query(collection(db, 'products'), orderBy('name')));
    const firestoreProducts = snapshot.docs.map((productDoc) => ({
      id: productDoc.id,
      ...productDoc.data()
    }));

    const merged = getFallbackProducts();
    if (firestoreProducts.length) {
      const existingIds = new Set(merged.map((p) => p.id));
      for (const product of firestoreProducts) {
        const idx = merged.findIndex((p) => p.id === product.id);
        if (idx >= 0) merged[idx] = product;
        else merged.push(product);
      }
    }
    return merged;
  } catch (error) {
    console.warn('Using demo catalog because Firestore products could not be loaded.', error);
    return getFallbackProducts();
  }
}

export async function getProductById(productId) {
  const all = await getProducts();
  return all.find((product) => product.id === productId || product.slug === productId) || null;
}

export async function saveProduct(product) {
  const nextProduct = {
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    stock: Number(product.stock || 0),
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    purchasable: true,
    inStock: true
  };

  if (!isFirebaseConfigured || !db) {
    const localProducts = JSON.parse(localStorage.getItem('demoAdminProducts') || '[]');
    const filtered = localProducts.filter((item) => item.id !== nextProduct.id);
    localStorage.setItem('demoAdminProducts', JSON.stringify([nextProduct, ...filtered]));
    return nextProduct;
  }

  await setDoc(doc(db, 'products', nextProduct.id), {
    ...nextProduct,
    updatedAt: serverTimestamp()
  });
  return nextProduct;
}

export async function createOrder(orderPayload) {
  const payload = {
    ...orderPayload,
    status: 'Processing',
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured || !db) {
    const orders = JSON.parse(localStorage.getItem('demoOrders') || '[]');
    const order = { id: `demo-${Date.now()}`, ...payload };
    localStorage.setItem('demoOrders', JSON.stringify([order, ...orders]));
    return order;
  }

  const orderRef = await addDoc(collection(db, 'orders'), {
    ...orderPayload,
    status: 'Processing',
    createdAt: serverTimestamp()
  });
  return { id: orderRef.id, ...payload };
}
