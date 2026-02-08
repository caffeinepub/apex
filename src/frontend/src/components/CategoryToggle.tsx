import { Category } from '../backend';

interface CategoryToggleProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryToggle({ selectedCategory, onCategoryChange }: CategoryToggleProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="inline-flex rounded-lg bg-muted p-1 w-full md:w-auto">
        <button
          onClick={() => onCategoryChange(Category.performance)}
          className={`
            flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all
            ${selectedCategory === Category.performance
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          Performance
        </button>
        <button
          onClick={() => onCategoryChange(Category.aesthetics)}
          className={`
            flex-1 md:flex-none px-6 py-2.5 rounded-md text-sm font-medium transition-all
            ${selectedCategory === Category.aesthetics
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          Aesthetics
        </button>
      </div>
    </div>
  );
}
