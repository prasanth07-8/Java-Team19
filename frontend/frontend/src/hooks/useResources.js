import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const useResources = () => {
    const queryClient = useQueryClient();

    const resourcesQuery = useQuery({
        queryKey: ['resources'],
        queryFn: async () => {
            const res = await api.get('/resources?page=0&size=100'); // Fetch all for now or implement pagination later
            return res.data.data.content;
        },
    });

    const addResourceMutation = useMutation({
        mutationFn: async (newResource) => {
            const res = await api.post('/resources', newResource);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resources']);
        },
    });

    const deleteResourceMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/resources/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resources']);
        },
    });

    return {
        resources: resourcesQuery.data || [],
        isLoading: resourcesQuery.isLoading,
        isError: resourcesQuery.isError,
        addResource: addResourceMutation.mutate,
        isAdding: addResourceMutation.isPending,
        deleteResource: deleteResourceMutation.mutate,
        isDeleting: deleteResourceMutation.isPending,
    };
};

export default useResources;
