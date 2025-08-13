import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import TaskList from '@/components/organisms/TaskList'
import FilterBar from '@/components/organisms/FilterBar'
import QuickAddTask from '@/components/organisms/QuickAddTask'
import ApperIcon from '@/components/ApperIcon'
import { categoryService } from '@/services/api/categoryService'

const TaskListPage = () => {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    priority: '',
    showCompleted: true,
    sortBy: 'dueDate'
  })

  useEffect(() => {
    if (categoryId) {
      loadCategory()
    }
  }, [categoryId])

  const loadCategory = async () => {
    try {
      const data = await categoryService.getById(categoryId)
      setCategory(data)
    } catch (error) {
      console.error('Error loading category:', error)
    }
  }

  const handleTaskAdded = () => {
    // Refresh the task list by updating the key
    // This will trigger a re-render of the TaskList component
    window.location.reload()
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

const pageTitle = category ? `${category.Name} Tasks` : 'All Tasks'
  const pageIcon = category ? category.icon_c : 'CheckSquare'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name={pageIcon} className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
              <p className="text-gray-600">
                {category 
                  ? `Manage your ${category.name.toLowerCase()} tasks`
                  : 'View and manage all your tasks'
                }
              </p>
            </div>
          </div>
          
          {category && (
            <div 
              className="w-4 h-4 rounded-full"
style={{ backgroundColor: category.color_c }}
            />
          )}
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          Add New Task
        </h2>
        <QuickAddTask onTaskAdded={handleTaskAdded} />
      </div>

      {/* Filter Bar */}
      <FilterBar 
        onFilterChange={handleFilterChange}
        filters={filters}
      />

      {/* Task List */}
      <div className="space-y-4">
        <TaskList 
          categoryId={categoryId ? parseInt(categoryId) : null}
          searchQuery={searchQuery}
          priorityFilter={filters.priority}
          showCompleted={filters.showCompleted}
        />
      </div>
    </div>
  )
}

export default TaskListPage