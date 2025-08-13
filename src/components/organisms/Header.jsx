import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = () => {
  const location = useLocation()
  const { user } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/tasks':
        return 'All Tasks'
      case '/settings':
        return 'Settings'
      default:
        if (location.pathname.startsWith('/tasks/')) {
          return 'Tasks'
        }
        return 'TaskFlow'
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    // You can emit this to parent components or use global state
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button - you can add mobile menu logic here */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <SearchBar
                placeholder="Search tasks..."
                onSearch={handleSearch}
                className="w-64"
              />
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.emailAddress
                      }
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
                title="Logout"
              >
                <ApperIcon name="LogOut" size={20} />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header