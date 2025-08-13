import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatsPanel from '@/components/organisms/StatsPanel'
import QuickAddTask from '@/components/organisms/QuickAddTask'
import TaskList from '@/components/organisms/TaskList'
import FilterBar from '@/components/organisms/FilterBar'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'

const Dashboard = () => {
  const [recentTasks, setRecentTasks] = useState([])
  const [filters, setFilters] = useState({
    priority: '',
    showCompleted: false,
    sortBy: 'dueDate'
  })

  useEffect(() => {
    loadRecentTasks()
  }, [])

  const loadRecentTasks = async () => {
    try {
const allTasks = await taskService.getAll()
      // Get recent incomplete tasks and recently completed tasks
      const incompleteTasks = allTasks.filter(task => !task.completed_c)
      const recentCompleted = allTasks
        .filter(task => task.completed_c)
        .sort((a, b) => new Date(b.completed_at_c) - new Date(a.completed_at_c))
        .slice(0, 3)
      
      setRecentTasks([...incompleteTasks, ...recentCompleted])
    } catch (error) {
      console.error('Error loading recent tasks:', error)
    }
  }

  const handleTaskAdded = (newTask) => {
    setRecentTasks(prev => [newTask, ...prev])
    // Refresh stats by reloading recent tasks
    loadRecentTasks()
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome to TaskFlow
            </h1>
            <p className="text-white/90">
              Stay organized and productive with your personal task manager
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="CheckSquare" size={48} className="text-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Statistics Panel */}
      <StatsPanel />

      {/* Quick Add Task */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          Quick Add Task
        </h2>
        <QuickAddTask onTaskAdded={handleTaskAdded} />
      </div>

      {/* Recent Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ApperIcon name="Clock" size={20} />
            Recent Tasks
          </h2>
        </div>
        
        <FilterBar 
          onFilterChange={handleFilterChange}
          filters={filters}
        />
        
        <TaskList 
          searchQuery=""
          priorityFilter={filters.priority}
          showCompleted={filters.showCompleted}
        />
      </div>
    </div>
  )
}

export default Dashboard