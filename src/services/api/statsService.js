import { taskService } from './taskService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const statsService = {
  async getStats() {
    await delay(200)
    
    const allTasks = await taskService.getAll()
    const today = new Date().toISOString().split('T')[0]
    
    // Calculate week start (Monday)
    const currentDate = new Date()
    const monday = new Date(currentDate)
    monday.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    const weekStart = monday.toISOString().split('T')[0]
    
// Daily stats
    const dailyTasks = allTasks.filter(task => {
      return task.due_date_c === today || task.completed_at_c === today
    })
    const dailyCompleted = dailyTasks.filter(task => task.completed_c).length
    const dailyTotal = dailyTasks.length
    
    // Weekly stats
    const weeklyTasks = allTasks.filter(task => {
      const taskDate = task.due_date_c || task.completed_at_c
      return taskDate >= weekStart
    })
    const weeklyCompleted = weeklyTasks.filter(task => task.completed_c).length
    const weeklyTotal = weeklyTasks.length
    
    // Streak calculation (simplified)
const completedTasks = allTasks.filter(task => task.completed_c).sort((a, b) => 
      new Date(b.completed_at_c) - new Date(a.completed_at_c)
    )
    
    let streak = 0
    let checkDate = new Date()
    
for (const task of completedTasks) {
      const taskDate = new Date(task.completed_at_c)
      const diffDays = Math.floor((checkDate - taskDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0 || diffDays === 1) {
        streak++
        checkDate = taskDate
      } else {
        break
      }
    }
    
    return {
      dailyCompleted,
      dailyTotal,
      weeklyCompleted,
      weeklyTotal,
      streak
    }
  }
}