import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useAddHabit, useGetHabitsByCategory } from '../hooks/useQueries';
import { Category } from '../backend';
import { Loader2, Infinity } from 'lucide-react';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddHabitDialog({ open, onOpenChange }: AddHabitDialogProps) {
  const [category, setCategory] = useState<Category>(Category.performance);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ease, setEase] = useState(3);
  const [effectiveness, setEffectiveness] = useState(3);
  const [affordability, setAffordability] = useState(3);
  const [anecdotes, setAnecdotes] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  const addHabitMutation = useAddHabit();
  const { data: categoryHabits = [] } = useGetHabitsByCategory(category);

  const totalScore = ease + effectiveness + affordability;

  // Count Critical habits in the selected category
  const criticalCount = categoryHabits.filter(h => h.isCritical).length;
  const canSetCritical = criticalCount < 7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const id = `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await addHabitMutation.mutateAsync({
      id,
      category,
      name: name.trim(),
      description: description.trim(),
      ease,
      effectiveness,
      affordability,
      anecdotes: anecdotes.trim(),
      isCritical: isCritical && canSetCritical,
    });

    // Reset form
    setName('');
    setDescription('');
    setEase(3);
    setEffectiveness(3);
    setAffordability(3);
    setAnecdotes('');
    setIsCritical(false);
    setCategory(Category.performance);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>
            Create a new habit and rate it based on ease, effectiveness, and affordability.
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
                <Label htmlFor="critical-status" className="cursor-pointer">Critical Status</Label>
                <Infinity className="h-4 w-4 text-cyan-400" />
              </div>
              <Switch
                id="critical-status"
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
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
              required
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
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
            <p className="text-xs text-muted-foreground">
              How easy is it to maintain this habit?
            </p>
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
            <p className="text-xs text-muted-foreground">
              How effective is this habit at achieving your goals?
            </p>
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
            <p className="text-xs text-muted-foreground">
              How affordable is this habit? (time, money, resources)
            </p>
          </div>

          {/* Anecdotes */}
          <div className="space-y-2">
            <Label htmlFor="anecdotes">Notes / Anecdotes</Label>
            <Textarea
              id="anecdotes"
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
            disabled={!name.trim() || addHabitMutation.isPending}
          >
            {addHabitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Habit'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
