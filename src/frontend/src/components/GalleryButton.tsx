import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryButtonProps {
  onClick: () => void;
}

export function GalleryButton({ onClick }: GalleryButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      variant="secondary"
      className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
    >
      <Eye className="h-6 w-6" />
    </Button>
  );
}
