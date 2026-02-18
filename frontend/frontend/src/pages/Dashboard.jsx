import { useMemo } from 'react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/dashboard/StatCard';
import ResourceChart from '../components/common/ResourceChart';
import useSystemData from '../hooks/useSystemData';
import {
    AlertCircle,
    BarChart2,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    LayoutList
} from 'lucide-react';
import { format, subDays } from 'date-fns'; // Would ideally use date-fns for bookings chart

const Dashboard = () => {
    // 1. Fetch real data using custom hook
    const results = useSystemData();
    const resourcesQuery = results[0];
    const bookingsQuery = results[1];

    const isLoading = resourcesQuery.isLoading || bookingsQuery.isLoading;
    const isError = resourcesQuery.isError || bookingsQuery.isError;

    // 2. Compute dynamic stats
    const stats = useMemo(() => {
        if (!resourcesQuery.data || !bookingsQuery.data) return null;

        const resources = resourcesQuery.data;
        const bookings = bookingsQuery.data;

        const totalResources = resources.length;
        const available = resources.filter(r => r.status === 'AVAILABLE').length; // Ensure backend uses consistent casing
        const booked = resources.filter(r => r.status === 'BOOKED').length;
        const maintenance = resources.filter(r => r.status === 'MAINTENANCE').length;

        const totalBookings = bookings.length;

        // Group bookings by date (simple implementation without date-fns for now, relies on ISO string)
        const bookingsByDate = bookings.reduce((acc, booking) => {
            const date = booking.startDate?.split('T')[0] || 'Unknown';
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Group resources by type
        const typeDistribution = resources.reduce((acc, resource) => {
            const type = resource.type || 'Other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        return {
            totalResources,
            available,
            booked,
            maintenance,
            totalBookings,
            bookingsByDate,
            typeDistribution
        };
    }, [resourcesQuery.data, bookingsQuery.data]);


    // 3. Prepare Chart Data
    const statusChartData = useMemo(() => {
        if (!stats) return null;
        return {
            labels: ['Available', 'Booked', 'Maintenance'],
            datasets: [{
                label: 'Resource Status',
                data: [stats.available, stats.booked, stats.maintenance],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], // Emerald, Amber, Red
                borderColor: ['#059669', '#D97706', '#DC2626'],
                borderWidth: 1,
            }]
        };
    }, [stats]);

    const bookingTrendData = useMemo(() => {
        if (!stats) return null;
        // Simple last 7 days simulation based on real data keys
        const labels = Object.keys(stats.bookingsByDate).sort().slice(-7);
        const data = labels.map(date => stats.bookingsByDate[date]);

        return {
            labels: labels.length ? labels : ['No Bookings'],
            datasets: [{
                label: 'Bookings Per Day',
                data: labels.length ? data : [0],
                borderColor: '#6366F1', // Indigo
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
                fill: true,
            }]
        };
    }, [stats]);

    const typeChartData = useMemo(() => {
        if (!stats) return null;
        const labels = Object.keys(stats.typeDistribution);
        const data = labels.map(type => stats.typeDistribution[type]);

        // Generate dynamic colors or use a palette
        const palette = ['#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6']; // Blue, Violet, Pink, Teal

        return {
            labels,
            datasets: [{
                label: 'Resource Types',
                data,
                backgroundColor: palette.slice(0, labels.length),
                borderWidth: 0,
            }]
        };
    }, [stats]);


    if (isError) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-red-100 h-[60vh]">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Dashboard</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-md">
                        We encountered an issue fetching the latest data from the server. Please ensure the backend is running.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    >
                        Retry Connection
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h2>
                    <p className="text-gray-500 mt-1">Real-time insights into campus resources and usage.</p>
                </div>
                <div className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Resources"
                    value={stats?.totalResources || 0}
                    icon={LayoutList}
                    colorClass="bg-indigo-600"
                    loading={isLoading}
                />
                <StatCard
                    title="Available Now"
                    value={stats?.available || 0}
                    icon={CheckCircle}
                    colorClass="bg-emerald-500"
                    loading={isLoading}
                />
                <StatCard
                    title="Active Bookings"
                    value={stats?.booked || 0}
                    icon={BookOpen}
                    colorClass="bg-amber-500"
                    loading={isLoading}
                />
                <StatCard
                    title="Total Bookings"
                    value={stats?.totalBookings || 0}
                    icon={Calendar}
                    colorClass="bg-purple-600"
                    loading={isLoading}
                    trend="+12%" // Placeholder trend, could be calculated if historical data exists
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Status Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-indigo-500" />
                            Resource Status
                        </h3>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        ) : (
                            <ResourceChart data={statusChartData} type="bar" />
                        )}
                    </div>
                </div>

                {/* Bookings Line Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" />
                            Booking Trends (Last 7 Days)
                        </h3>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        ) : (
                            <ResourceChart data={bookingTrendData} type="line" />
                        )}
                    </div>
                </div>
            </div>

            {/* Resource Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Resource Allocation</h3>
                    <div className="h-64 flex items-center justify-center relative">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        ) : (
                            <ResourceChart data={typeChartData} type="doughnut" options={{ cutout: '70%' }} />
                        )}
                        {/* Center text for doughnut */}
                        {!isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-800">{stats?.totalResources}</span>
                                <span className="text-xs text-gray-500 uppercase">Items</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Need a new resource?</h3>
                        <p className="text-indigo-100 mb-6 max-w-lg">
                            Easily browse the catalog to find available equipment, rooms, and labs for your next project or class directly from the dashboard.
                        </p>
                        <button className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
                            Browse Catalog
                        </button>
                    </div>
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 right-20 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-xl"></div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
