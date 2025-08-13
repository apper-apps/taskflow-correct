import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { categoryService } from '@/services/api/categoryService'

const CategoryList = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      setError('Failed to load categories')
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
          Categories
        </h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg skeleton"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
          Categories
        </h3>
        <Error 
          message={error} 
          onRetry={loadCategories}
          showRetry={true}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
        Categories
      </h3>
      
      <div className="space-y-1">
        {categories.map((category) => (
          <motion.div
            key={category.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NavLink
              to={`/tasks/${category.Id}`}
              onClick={onCategoryClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                }`
              }
            >
<div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color_c }}
              />
              <ApperIcon name={category.icon_c} size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium truncate flex-1">
                {category.Name}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-200 group-hover:bg-gray-300 rounded-full">
                {category.task_count_c}
              </span>
            </NavLink>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList