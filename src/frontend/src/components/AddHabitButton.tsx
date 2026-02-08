import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddHabitButtonProps {
  onClick: () => void;
}

export function AddHabitButton({ onClick }: AddHabitButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
