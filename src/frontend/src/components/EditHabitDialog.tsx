import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useEditHabit, useGetHabitsByCategory } from '../hooks/useQueries';
import { Category, type Habit } from '../backend';
import { Loader2, Infinity } from 'lucide-react';

interface EditHabitDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
  const [category, setCategory] = useState<Category>(habit.category);
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [ease, setEase] = useState(Number(habit.ease));
  const [effectiveness, setEffectiveness] = useState(Number(habit.effectiveness));
  const [affordability, setAffordability] = useState(Number(habit.affordability));
  const [anecdotes, setAnecdotes] = useState(habit.anecdotes);
  const [isCritical, setIsCritical] = useState(habit.isCritical);

  const editHabitMutation = useEditHabit();
  const { data: categoryHabits = [] } = useGetHabitsByCategory(category);

  // Reset form when habit changes
  useEffect(() => {
    setCategory(habit.category);
    setName(habit.name);
    setDescription(habit.description);
    setEase(Number(habit.ease));
    setEffectiveness(Number(habit.effectiveness));
    setAffordability(Number(habit.affordability));
    setAnecdotes(habit.anecdotes);
    setIsCritical(habit.isCritical);
  }, [habit]);

  const totalScore = ease + effectiveness + affordability;

  // Count Critical habits in the selected category (excluding current habit if it's already Critical)
  const criticalCount = categoryHabits.filter(h => h.isCritical && h.id !== habit.id).length;
  const canSetCritical = criticalCount < 7 || habit.isCritical;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    await editHabitMutation.mutateAsync({
      id: habit.id,
      category,
      name: name.trim(),
      description: description.trim(),
      ease,
      effectiveness,
      affordability,
      anecdotes: anecdotes.trim(),
      isCritical: isCritical && canSetCritical,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update your habit details and ratings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={category === Category.performance ? 'default' : 'outline'}
                onClick={() => setCategory(Category.performance)}
                className="flex-1"
              >
                Performance
              </Button>
              <Button
                type="button"
                variant={category === Category.aesthetics ? 'default' : 'outline'}
                onClick={() => setCategory(Category.aesthetics)}
                className="flex-1"
              >
                Aesthetics
              </Button>
            </div>
          </div>

          {/* Critical Status Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-critical-status" className="cursor-pointer">Critical Status</Label>
                <Infinity className="h-4 w-4 text-cyan-400" />
              </div>
              <Switch
                id="edit-critical-status"
                checked={isCritical}
                onCheckedChange={setIsCritical}
                disabled={!canSetCritical}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {canSetCritical 
                ? `Mark as Critical habit (${criticalCount}/7 Critical habits in this category)`
                : `Maximum of 7 Critical habits reached in this category (${criticalCount}/7)`
              }
            </p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Habit Name *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
              required
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the habit..."
              maxLength={100}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/100 characters
            </p>
          </div>

          {/* Ease Rating */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Ease</Label>
              <span className="text-sm font-semibold text-foreground">{ease}/5</span>
            </div>
            <Slider
              value={[ease]}
              onValueChange={(value) => setEase(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Effectiveness Rating */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Effectiveness</Label>
              <span className="text-sm font-semibold text-foreground">{effectiveness}/5</span>
            </div>
            <Slider
              value={[effectiveness]}
              onValueChange={(value) => setEffectiveness(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Affordability Rating */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Affordability</Label>
              <span className="text-sm font-semibold text-foreground">{affordability}/5</span>
            </div>
            <Slider
              value={[affordability]}
              onValueChange={(value) => setAffordability(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>

          {/* Anecdotes */}
          <div className="space-y-2">
            <Label htmlFor="edit-anecdotes">Notes / Anecdotes</Label>
            <Textarea
              id="edit-anecdotes"
              value={anecdotes}
              onChange={(e) => setAnecdotes(e.target.value)}
              placeholder="Personal experiences, tips, or observations..."
              rows={3}
            />
          </div>

          {/* Total Score Display */}
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Total Score</div>
            <div className="text-3xl font-bold text-foreground">{totalScore}/15</div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || editHabitMutation.isPending}
          >
            {editHabitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Habit'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
