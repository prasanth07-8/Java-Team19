import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart,
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Menu,
    User
} from 'lucide-react';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col fixed inset-y-0 left-0 z-10 transition-transform duration-300 md:translate-x-0">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">
                        C
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Campus CRM
                    </h1>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors group"
                            >
                                <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/resources')}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors group"
                            >
                                <BarChart className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                Resources
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/bookings')}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors group"
                            >
                                <CalendarDays className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                Bookings
                            </button>
                        </li>
                        {isAdmin && (
                            <div className="mt-8 pt-4 border-t border-gray-100">
                                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin</p>
                                <li>
                                    <button
                                        onClick={() => navigate('/users')}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors group"
                                    >
                                        <User className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                                        Manage Users
                                    </button>
                                </li>
                            </div>
                        )}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.role || 'Member'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 bg-gray-50 min-h-screen">
                {/* Header for mobile triggers mostly, or page titles */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between md:hidden">
                    <span className="font-bold text-lg">Campus CRM</span>
                    <button className="p-2 rounded-md hover:bg-gray-100">
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
