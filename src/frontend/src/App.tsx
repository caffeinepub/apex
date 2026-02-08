import { useState } from 'react';
import { Header } from './components/Header';
import { CategoryToggle } from './components/CategoryToggle';
import { HabitList } from './components/HabitList';
import { AddHabitButton } from './components/AddHabitButton';
import { GalleryButton } from './components/GalleryButton';
import { AddHabitDialog } from './components/AddHabitDialog';
import { PhotoGallery } from './components/PhotoGallery';
import { Footer } from './components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { Category } from './backend';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.performance);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6 md:py-8">
        <CategoryToggle 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <HabitList selectedCategory={selectedCategory} />
      </main>

      <Footer />
      
      <GalleryButton onClick={() => setIsGalleryOpen(true)} />
      <AddHabitButton onClick={() => setIsAddDialogOpen(true)} />
      
      <AddHabitDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      
      <PhotoGallery 
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
      />
      
      <Toaster />
    </div>
  );
}

export default App;
