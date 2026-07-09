export function formatCurrency(value) {
  if (!Number(value)) return 'Call 0311-7862200';

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function getEffectivePrice(product) {
  return Number(product.discountPrice || product.price || product.regularPrice || 0);
}

export function getDisplayPrice(product) {
  if (product.priceText && !Number(product.price)) return product.priceText;
  return formatCurrency(getEffectivePrice(product));
}
