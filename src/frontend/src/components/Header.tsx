import { useState, useRef, useEffect } from 'react';
import { useGetHeaderTitle, useUpdateHeaderTitle } from '../hooks/useQueries';

export function Header() {
  const { data: savedTitle, isLoading } = useGetHeaderTitle();
  const updateTitleMutation = useUpdateHeaderTitle();
  
  const [title, setTitle] = useState('Habit Tier List');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local title when saved title is loaded
  useEffect(() => {
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, [savedTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const saveTitle = () => {
    const trimmedTitle = title.trim();
    const finalTitle = trimmedTitle === '' ? 'Habit Tier List' : trimmedTitle;
    
    setTitle(finalTitle);
    updateTitleMutation.mutate(finalTitle);
  };

  const handleBlur = () => {
    setIsEditing(false);
    saveTitle();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      saveTitle();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      // Revert to saved title on escape
      if (savedTitle) {
        setTitle(savedTitle);
      }
    }
  };

  if (isLoading) {
    return (
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="h-10 bg-slate-700 animate-pulse rounded w-64 mx-auto"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight bg-transparent border-b-2 border-primary outline-none w-full text-center"
          />
        ) : (
          <h1
            onClick={handleClick}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight cursor-pointer hover:text-primary transition-colors text-center"
          >
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}
