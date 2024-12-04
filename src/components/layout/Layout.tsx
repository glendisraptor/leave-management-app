import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import {
    LayoutDashboard,
    Calendar,
    User,
    Users,
    LogOut,
} from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const { logout, account } = useAuth();

    const isManager = true; // Replace with actual role check

    const navigation = [
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Request Leave', href: '/leave-request', icon: Calendar },
        { name: 'Leave Statistics', href: '/leave-statistics', icon: LayoutDashboard },
        { name: 'Calender', href: '/calender', icon: LayoutDashboard },
        ...(isManager
            ? [
                { name: 'Approve Requests', href: '/manager', icon: Users },
                { name: 'Projects', href: '/projects', icon: Users },
            ]
            : []),
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="hidden md:flex md:flex-shrink-0">
                    <div className="flex flex-col w-64">
                        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <h1 className="text-xl font-semibold">Leave Management</h1>
                            </div>
                            <div className="mt-5 flex-grow flex flex-col">
                                <nav className="flex-1 px-2 space-y-1">
                                    {navigation.map((item) => {
                                        const IconComponent = item.icon;
                                        const isActive = location.pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className={`${isActive
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                            >
                                                <IconComponent
                                                    className={`${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                                                        } mr-3 flex-shrink-0 h-6 w-6`}
                                                />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                <div className="flex items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{account?.name}</p>
                                        <p className="text-xs text-gray-500">{account?.username}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="ml-3"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1">
                    <main className="flex-1 overflow-y-auto focus:outline-none">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};