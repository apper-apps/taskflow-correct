import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import CategorySelector from '@/components/molecules/CategorySelector'
import PrioritySelector from '@/components/molecules/PrioritySelector'
import DatePicker from '@/components/molecules/DatePicker'
import FormField from '@/components/molecules/FormField'
import { taskService } from '@/services/api/taskService'

const QuickAddTask = ({ onTaskAdded }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
const [formData, setFormData] = useState({
    title_c: '',
    description_c: '',
    category_id_c: '',
    priority_c: 'medium',
    due_date_c: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
if (!formData.title_c.trim()) {
      toast.error('Task title is required')
      return
    }

    if (!formData.category_id_c) {
      toast.error('Please select a category')
      return
    }

    try {
      setLoading(true)
      const newTask = await taskService.create(formData)
      
setFormData({
        title_c: '',
        description_c: '',
        category_id_c: '',
        priority_c: 'medium',
        due_date_c: null
      })
      
      setIsExpanded(false)
      onTaskAdded(newTask)
      toast.success('Task added successfully!')
    } catch (error) {
      toast.error('Failed to add task')
      console.error('Error adding task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (formData.title.trim() && formData.categoryId) {
      handleSubmit(e)
    } else {
      setIsExpanded(true)
    }
  }

  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-md p-4 border-2 border-dashed border-gray-300 hover:border-primary transition-colors duration-200"
    >
      <form onSubmit={handleQuickAdd}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="border-none shadow-none focus:ring-0 focus:border-none text-lg"
            />
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-primary"
          >
            <ApperIcon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                <FormField
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Add more details..."
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<CategorySelector
                    value={formData.category_id_c}
                    onChange={(value) => handleChange('category_id_c', value)}
                  />
                  
                  <PrioritySelector
                    value={formData.priority}
                    onChange={(value) => handleChange('priority', value)}
                  />
                  
<DatePicker
                    label="Due Date"
                    value={formData.due_date_c}
                    onChange={(value) => handleChange('due_date_c', value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {!isExpanded && (
<CategorySelector
                value={formData.category_id_c}
                onChange={(value) => handleChange('category_id_c', value)}
                showLabel={false}
              />
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="min-w-[100px]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : (
              <>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Task
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default QuickAddTask