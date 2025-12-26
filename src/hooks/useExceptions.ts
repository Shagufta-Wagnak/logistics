import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { useUIStore } from '@/stores/uiStore';

export function useExceptions() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const { data: exceptions = [], isLoading, error } = useQuery({
    queryKey: ['exceptions'],
    queryFn: api.fetchExceptions,
    staleTime: 60 * 1000, // 1 minute
  });

  const resolveMutation = useMutation({
    mutationFn: ({ exceptionId, resolution }: { exceptionId: string; resolution: string }) =>
      api.resolveException(exceptionId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
      addNotification({
        type: 'success',
        title: 'Exception resolved',
        message: 'The exception has been marked as resolved',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Failed to resolve',
        message: 'Could not resolve the exception. Please try again.',
      });
    },
  });

  return {
    exceptions,
    isLoading,
    error,
    resolveException: (exceptionId: string, resolution: string) =>
      resolveMutation.mutate({ exceptionId, resolution }),
    isResolving: resolveMutation.isPending,
  };
}

