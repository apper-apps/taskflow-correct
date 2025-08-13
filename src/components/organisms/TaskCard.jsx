import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isAfter, isBefore, isToday } from 'date-fns'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggleComplete = async () => {
    try {
      setIsCompleting(true)
      
      let updatedTask
      if (task.completed) {
        updatedTask = await taskService.markIncomplete(task.Id)
        toast.info('Task marked as incomplete')
      } else {
        updatedTask = await taskService.markComplete(task.Id)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 1000)
        toast.success('Task completed! 🎉')
      }
      
      onUpdate(updatedTask)
    } catch (error) {
      toast.error('Failed to update task')
      console.error('Error updating task:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id)
        onDelete(task.Id)
        toast.success('Task deleted')
      } catch (error) {
        toast.error('Failed to delete task')
        console.error('Error deleting task:', error)
      }
    }
  }

const getDueDateStatus = () => {
    if (!task.due_date_c) return null
    
    const dueDate = new Date(task.due_date_c)
    const today = new Date()
    
    if (isToday(dueDate)) {
      return { status: 'today', label: 'Due Today', color: 'warning' }
    } else if (isBefore(dueDate, today)) {
      return { status: 'overdue', label: 'Overdue', color: 'error' }
    } else {
      return { status: 'upcoming', label: format(dueDate, 'MMM dd'), color: 'info' }
    }
  }

  const dueDateStatus = getDueDateStatus()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 border-l-4 relative overflow-hidden ${
        task.completed_c ? 'opacity-75' : ''
      }`}
      style={{ borderLeftColor: task.categoryColor || '#5B4FE9' }}
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: '50%',
                  opacity: 1,
                  rotate: 0
                }}
                animate={{
                  y: '-100%',
                  opacity: 0,
                  rotate: 360
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          disabled={isCompleting}
className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
            task.completed_c
              ? 'bg-gradient-to-r from-success to-green-600 border-success'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed_c && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white"
            >
              <ApperIcon name="Check" size={12} />
            </motion.div>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
<h3 className={`font-medium text-gray-800 ${
                task.completed_c ? 'line-through text-gray-500' : ''
              }`}>
                {task.title_c}
              </h3>
              {task.description_c && (
                <p className="text-sm text-gray-600 mt-1">
                  {task.description_c}
                </p>
              )}
            </div>
            
            {/* Priority Badge */}
<Badge 
              variant={task.priority_c} 
              size="sm"
              className={task.priority_c === 'urgent' ? 'animate-pulse' : ''}
            >
              {task.priority_c}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {dueDateStatus && (
                <Badge variant={dueDateStatus.color} size="sm">
                  <ApperIcon name="Calendar" size={12} className="mr-1" />
                  {dueDateStatus.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-gray-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard