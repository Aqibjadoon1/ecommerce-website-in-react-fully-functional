import { BadgeCheck, Headphones, RotateCcw, Truck } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Fast delivery', text: 'Free above Rs. 5,000' },
  { icon: BadgeCheck, title: 'Brand warranty', text: 'Clear warranty on every item' },
  { icon: RotateCcw, title: 'Easy returns', text: 'Simple 7-day return flow' },
  { icon: Headphones, title: 'Real support', text: 'Help before and after checkout' }
];

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Store trust signals">
      {items.map((item) => (
        <div key={item.title}>
          <item.icon size={24} />
          <div>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
