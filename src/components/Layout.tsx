import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import SafetyBanner from './SafetyBanner';

interface LayoutProps {
  children: ReactNode;
  showSafetyBanner?: boolean;
}

export default function Layout({ children, showSafetyBanner = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {showSafetyBanner && <SafetyBanner />}
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
