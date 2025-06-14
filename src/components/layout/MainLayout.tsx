
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, Calendar, Users, Home, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navigation = [
    { name: "Töölaud", href: "/dashboard", icon: Home },
    { name: "Üritused", href: "/events", icon: Calendar },
    { name: "Perekond", href: "/family", icon: Users },
    { name: "Admin", href: "/admin", icon: Settings, adminOnly: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-green-100">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-green-700">MTÜ Tartu Pereliit</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-1">
              {navigation.filter(item => !item.adminOnly || user?.isAdmin).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-green-100 text-green-700 border-r-2 border-green-600"
                        : "text-gray-700 hover:bg-green-50"
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-green-700" : "text-gray-400 group-hover:text-green-600"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50" 
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logi välja
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-sm w-full fixed top-0 z-10 border-b border-green-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-green-700">MTÜ Tartu Pereliit</h1>
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button variant="outline" size="icon" className="h-8 w-8 border-green-200">
              <span className="sr-only">Ava menüü</span>
              <svg
                className="h-5 w-5 text-green-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Content area */}
        <main className="flex-1 pt-4 md:pt-0">
          <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
