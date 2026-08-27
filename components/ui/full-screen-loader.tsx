// components/ui/full-screen-loader.tsx

import { Loader } from './loader';

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}
