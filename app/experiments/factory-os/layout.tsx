import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HomeLab | Experiments',
  description: 'Automated arbitrage pipeline - research overpriced products, 3D print cheaper alternatives, flood the market.',
};

export default function HomeLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
