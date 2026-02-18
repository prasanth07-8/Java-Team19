import { useQueries } from '@tanstack/react-query';
import api from '../services/api';

// Mock data for development/demo when backend is offline
const MOCK_RESOURCES = [
    { id: 1, name: 'Projector A', status: 'AVAILABLE', type: 'Equipment' },
    { id: 2, name: 'Main Hall', status: 'BOOKED', type: 'Room' },
    { id: 3, name: 'Lab 1', status: 'AVAILABLE', type: 'Lab' },
    { id: 4, name: 'Camera Kit', status: 'MAINTENANCE', type: 'Equipment' },
    { id: 5, name: 'Conference Room B', status: 'AVAILABLE', type: 'Room' },
    { id: 6, name: 'Laptop C', status: 'AVAILABLE', type: 'Equipment' },
    { id: 7, name: 'Speaker System', status: 'BOOKED', type: 'Equipment' },
];

const MOCK_BOOKINGS = [
    { id: 1, resourceId: 2, startDate: new Date().toISOString() }, // Today
    { id: 2, resourceId: 4, startDate: new Date(Date.now() - 86400000).toISOString() }, // Yesterday
    { id: 3, resourceId: 1, startDate: new Date(Date.now() - 172800000).toISOString() }, // 2 days ago
    { id: 4, resourceId: 5, startDate: new Date(Date.now() - 259200000).toISOString() }, // 3 days ago
    { id: 5, resourceId: 5, startDate: new Date(Date.now() - 345600000).toISOString() }, // 4 days ago
];

const useSystemData = () => {
    return useQueries({
        queries: [
            {
                queryKey: ['resources'],
                queryFn: async () => {

                    const res = await api.get('/resources');
                    // Backend returns ApiResponse<Page<ResourceDto>>
                    // res.data is ApiResponse
                    // res.data.data is Page object
                    // res.data.data.content is the array
                    return res.data.data.content;

                },
                retry: 1,
            },
            {
                queryKey: ['bookings'],
                queryFn: async () => {

                    const res = await api.get('/bookings');
                    return res.data.data.content;

                },
                retry: 1,
            },
        ],
    });
};

export default useSystemData;
