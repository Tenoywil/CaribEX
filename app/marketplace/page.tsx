import { Suspense } from 'react';
import { BrowsePage } from '@/components/marketplace/BrowsePage';
import { Loader } from '@/components/ui/Loader';

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    }>
      <BrowsePage />
    </Suspense>
  );
}
