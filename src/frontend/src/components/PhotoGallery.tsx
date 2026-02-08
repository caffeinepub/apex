import { useState, useRef } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useGetGalleryImages, useAddGalleryImage, useRemoveGalleryImage } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import type { CarouselApi } from '@/components/ui/carousel';

interface PhotoGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoGallery({ open, onOpenChange }: PhotoGalleryProps) {
  const { data: images = [], isLoading } = useGetGalleryImages();
  const addImage = useAddGalleryImage();
  const removeImage = useRemoveGalleryImage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const response = await addImage.mutateAsync({ id, blob });
      
      // Reset upload progress after successful upload
      setUploadProgress(null);
      
      // Log success for debugging
      if (response.success) {
        console.log('Image uploaded successfully:', response.id);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      setUploadProgress(null);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveCurrentPhoto = async () => {
    if (images.length === 0) return;
    
    const [currentId] = images[currentIndex];
    await removeImage.mutateAsync(currentId);
    
    // Adjust carousel position if needed
    if (currentIndex >= images.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      carouselApi?.scrollTo(currentIndex - 1);
    }
  };

  // Update current index when carousel changes
  const handleCarouselChange = (api: CarouselApi) => {
    if (!api) return;
    
    setCarouselApi(api);
    
    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
      <DialogContent 
        className="w-[85vw] h-[85vh] max-w-none p-0 bg-slate-900 border-slate-700 overflow-hidden rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 [&>button]:hidden"
        onPointerDownOutside={() => onOpenChange(false)}
      >
        <div className="relative w-full h-full flex flex-col min-h-0">
          {/* Ultra-slim elegant header with minimal icon controls */}
          <div className="flex items-center justify-end px-2.5 py-1.5 border-b border-slate-700/40 bg-slate-900/98 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Button
                onClick={handleAddPhoto}
                size="icon"
                variant="ghost"
                disabled={addImage.isPending || uploadProgress !== null}
                className="h-7 w-7 hover:bg-slate-800/60 text-slate-400 hover:text-slate-50 transition-all duration-200"
                title="Add photo"
              >
                {uploadProgress !== null ? (
                  <span className="text-xs font-medium">{Math.round(uploadProgress)}%</span>
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                onClick={handleRemoveCurrentPhoto}
                size="icon"
                variant="ghost"
                disabled={removeImage.isPending || images.length === 0}
                className="h-7 w-7 hover:bg-slate-800/60 text-white hover:text-slate-200 transition-all duration-200"
                title="Delete current photo"
              >
                {removeImage.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Gallery Content */}
          <div className="flex-1 flex items-center justify-center overflow-hidden bg-slate-950/50 min-h-0">
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin" />
                Loading gallery...
              </div>
            ) : images.length === 0 ? (
              <Button 
                onClick={handleAddPhoto} 
                size="icon"
                variant="ghost"
                disabled={addImage.isPending || uploadProgress !== null}
                className="h-16 w-16 rounded-full hover:bg-slate-800/80 text-slate-400 hover:text-slate-50 transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
                title="Add photo"
              >
                {uploadProgress !== null ? (
                  <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
                ) : (
                  <Plus className="h-8 w-8" />
                )}
              </Button>
            ) : (
              <Carousel 
                className="w-full h-full"
                setApi={handleCarouselChange}
                opts={{
                  loop: true,
                }}
              >
                <CarouselContent className="h-full">
                  {images.map(([id, blob]) => (
                    <CarouselItem key={id} className="h-full flex items-center justify-center">
                      <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
                        <img
                          src={blob.getDirectURL()}
                          alt="Gallery photo"
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>

          {/* Footer with counter */}
          {images.length > 0 && (
            <div className="px-3 py-2 border-t border-slate-700/40 text-center text-sm text-slate-400 bg-slate-900/98 flex-shrink-0">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}
