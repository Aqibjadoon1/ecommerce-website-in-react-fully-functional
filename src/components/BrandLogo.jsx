import { brandConfig } from '../config/brand';

export default function BrandLogo({ compact = false }) {
  return (
    <span className="brand-logo-custom" aria-label={brandConfig.name}>
      <img src="/logo.png" alt="" width="42" height="42" className="brand-symbol-img" />
      {!compact && (
        <span className="brand-wordmark">
          <strong>New Murtaza</strong>
          <span>Asif Traders</span>
        </span>
      )}
    </span>
  );
}
