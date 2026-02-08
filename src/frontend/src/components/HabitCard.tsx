import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2, Infinity } from 'lucide-react';
import { type Habit } from '../backend';
import { Button } from '@/components/ui/button';
import { EditHabitDialog } from './EditHabitDialog';
import { DeleteHabitDialog } from './DeleteHabitDialog';

interface HabitCardProps {
  habit: Habit;
  rank: number;
}

function getTierInfo(score: number) {
  if (score >= 13) {
    return { tier: 'S', color: 'tier-s' };
  } else if (score >= 10) {
    return { tier: 'A', color: 'tier-a' };
  } else {
    return { tier: 'B', color: 'tier-b' };
  }
}

export function HabitCard({ habit, rank }: HabitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const score = Number(habit.totalScore);
  const { tier, color } = getTierInfo(score);
  const isCritical = habit.isCritical;

  return (
    <>
      <div className={`bg-card border rounded-lg overflow-hidden transition-all ${
        isCritical 
          ? 'critical-habit border-critical shadow-critical' 
          : `border-border hover:border-accent ${color}`
      }`}>
        {/* Collapsed State */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full px-4 py-4 flex items-center justify-between text-left transition-colors ${
            isCritical ? 'hover:bg-critical/5' : 'hover:bg-accent/5'
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground font-medium text-sm">#{rank}</span>
              {isCritical ? (
                <div className="critical-badge">
                  <Infinity className="h-4 w-4" />
                </div>
              ) : (
                <span className={`tier-badge tier-badge-${tier.toLowerCase()}`}>
                  {tier}
                </span>
              )}
            </div>
            <h3 className="font-medium text-foreground truncate flex-1 text-sm">
              {habit.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{score}</div>
              <div className="text-xs text-muted-foreground">/ 15</div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </button>

        {/* Expanded State */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-border animate-accordion-down">
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-foreground text-base break-words flex-1">
                  {habit.name}
                </h3>
                {isCritical && (
                  <div className="flex items-center gap-1 text-critical text-xs font-semibold">
                    <Infinity className="h-3.5 w-3.5" />
                    <span>CRITICAL</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {habit.description}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Ease</div>
                <div className="text-lg font-semibold text-foreground">
                  {Number(habit.ease)}/5
                </div>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Effectiveness</div>
                <div className="text-lg font-semibold text-foreground">
                  {Number(habit.effectiveness)}/5
                </div>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Affordability</div>
                <div className="text-lg font-semibold text-foreground">
                  {Number(habit.affordability)}/5
                </div>
              </div>
            </div>

            {/* Anecdotes */}
            {habit.anecdotes && (
              <div className="bg-muted/30 rounded-md p-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Notes
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {habit.anecdotes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="flex-1"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      <EditHabitDialog
        habit={habit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeleteHabitDialog
        habit={habit}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
