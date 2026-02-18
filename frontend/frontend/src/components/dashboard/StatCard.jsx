import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass = "bg-indigo-500", trend, loading }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide uppercase">{title}</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-white shadow-inner`}>
                            <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
                        </div>
                    </div>

                    {trend && (
                        <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            <span>{trend}</span>
                            <span className="text-gray-400 font-normal ml-1">vs last month</span>
                        </div>
                    )}

                    {/* Decorative background element */}
                    <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}></div>
                </>
            )}
        </div>
    );
};

export default StatCard;
