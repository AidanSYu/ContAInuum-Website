import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6 text-center">
      <p className="font-mono-tech text-sm uppercase tracking-[0.3em] text-safety">Error 404</p>
      <h1 className="mt-4 font-display text-6xl font-bold text-text-primary">Lost in the void</h1>
      <p className="mt-4 max-w-md text-text-secondary">
        The page you’re looking for doesn’t exist or has drifted out of orbit.
      </p>
      <Button asChild className="mt-8 bg-safety text-white hover:bg-safety/90">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
