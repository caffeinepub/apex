import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, type Habit, ExternalBlob, type GalleryAddImageResponse } from '../backend';
import { toast } from 'sonner';

export function useGetHabitsByCategory(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<Habit[]>({
    queryKey: ['habits', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHabitsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllHabits() {
  const { actor, isFetching } = useActor();

  return useQuery<Habit[]>({
    queryKey: ['habits', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHabits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHabit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      category: Category;
      name: string;
      description: string;
      ease: number;
      effectiveness: number;
      affordability: number;
      anecdotes: string;
      isCritical: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addHabit(
        params.id,
        params.category,
        params.name,
        params.description,
        BigInt(params.ease),
        BigInt(params.effectiveness),
        BigInt(params.affordability),
        params.anecdotes,
        params.isCritical
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Habit added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add habit: ${error.message}`);
    },
  });
}

export function useEditHabit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      category: Category;
      name: string;
      description: string;
      ease: number;
      effectiveness: number;
      affordability: number;
      anecdotes: string;
      isCritical: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.editHabit(
        params.id,
        params.category,
        params.name,
        params.description,
        BigInt(params.ease),
        BigInt(params.effectiveness),
        BigInt(params.affordability),
        params.anecdotes,
        params.isCritical
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Habit updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update habit: ${error.message}`);
    },
  });
}

export function useDeleteHabit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteHabit(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success('Habit deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete habit: ${error.message}`);
    },
  });
}

// Gallery hooks
export function useGetGalleryImages() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, ExternalBlob]>>({
    queryKey: ['gallery', 'images'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; blob: ExternalBlob }): Promise<GalleryAddImageResponse> => {
      if (!actor) throw new Error('Actor not initialized');
      const response = await actor.addGalleryImage(params.id, params.blob);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add image to gallery');
      }
      
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success(response.message || 'Photo added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add photo: ${error.message}`);
    },
  });
}

export function useRemoveGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Photo removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove photo: ${error.message}`);
    },
  });
}

// Header title hooks
export function useGetHeaderTitle() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['headerTitle'],
    queryFn: async () => {
      if (!actor) return 'Habit Tier List';
      return actor.getHeaderTitle();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateHeaderTitle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTitle: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateHeaderTitle(newTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['headerTitle'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update title: ${error.message}`);
    },
  });
}
