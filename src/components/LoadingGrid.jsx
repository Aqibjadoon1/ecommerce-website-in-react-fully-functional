export default function LoadingGrid() {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
