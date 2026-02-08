import { useGetHabitsByCategory } from '../hooks/useQueries';
import { HabitCard } from './HabitCard';
import { Category } from '../backend';
import { Loader2 } from 'lucide-react';

interface HabitListProps {
  selectedCategory: Category;
}

export function HabitList({ selectedCategory }: HabitListProps) {
  const { data: habits, isLoading } = useGetHabitsByCategory(selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          No habits yet. Add your first habit to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => (
        <HabitCard key={habit.id} habit={habit} rank={index + 1} />
      ))}
    </div>
  );
}
