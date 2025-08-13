import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/organisms/TaskCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { taskService } from '@/services/api/taskService'

const TaskList = ({ categoryId, searchQuery = '', priorityFilter = '', showCompleted = true }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTasks()
  }, [categoryId])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      
      let data
      if (categoryId) {
        data = await taskService.getByCategory(categoryId)
      } else {
        data = await taskService.getAll()
      }
      
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.Id === updatedTask.Id ? updatedTask : task
      )
    )
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.filter(task => task.Id !== taskId)
    )
  }

  // Filter tasks based on search and filters
const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description_c?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesPriority = !priorityFilter || task.priority_c === priorityFilter
    
    const matchesCompleted = showCompleted || !task.completed_c
    
    return matchesSearch && matchesPriority && matchesCompleted
  })

  // Sort tasks: incomplete first, then by priority, then by due date
const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed_c !== b.completed_c) {
      return a.completed_c ? 1 : -1
    }
    
    // Sort by priority
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority_c] - priorityOrder[a.priority_c]
    if (priorityDiff !== 0) return priorityDiff
    
    // Sort by due date
    if (a.due_date_c && b.due_date_c) {
      return new Date(a.due_date_c) - new Date(b.due_date_c)
    }
    if (a.due_date_c) return -1
    if (b.due_date_c) return 1
    
    // Finally by creation date
    return new Date(b.created_at_c) - new Date(a.created_at_c)
  })

  if (loading) {
    return <Loading message="Loading tasks..." />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadTasks}
        showRetry={true}
      />
    )
  }

  if (sortedTasks.length === 0) {
    return (
      <Empty
        title="No tasks found"
        description={searchQuery ? `No tasks match "${searchQuery}"` : "Ready to tackle your day? Add your first task!"}
        icon="CheckSquare"
      />
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList