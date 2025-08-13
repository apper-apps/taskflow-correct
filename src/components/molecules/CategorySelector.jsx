import { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { categoryService } from '@/services/api/categoryService'

const CategorySelector = ({ value, onChange, showLabel = true }) => {
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = categories.find(c => c.Id === value)

  const handleSelect = (category) => {
    onChange(category.Id)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
        )}
        <div className="w-full h-10 bg-gray-200 rounded-lg skeleton"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between border-2 border-gray-200 hover:border-primary"
      >
        <div className="flex items-center gap-2">
          {selectedCategory ? (
            <>
<div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedCategory.color_c }}
              />
              <ApperIcon name={selectedCategory.icon_c} size={16} />
              <span>{selectedCategory.Name}</span>
            </>
          ) : (
            <span className="text-gray-500">Select category</span>
          )}
        </div>
        <ApperIcon name="ChevronDown" size={16} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {categories.map((category) => (
            <button
              key={category.Id}
              type="button"
              onClick={() => handleSelect(category)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
            >
<div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: category.color_c }}
              />
              <ApperIcon name={category.icon_c} size={16} />
              <span>{category.Name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategorySelector