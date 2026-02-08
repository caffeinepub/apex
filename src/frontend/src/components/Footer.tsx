import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2025. Built with{' '}
          <Heart className="inline h-4 w-4 text-rose-500 fill-rose-500" />{' '}
          using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
