const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'category_c';

export const categoryService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "task_count_c" } },
          { field: { Name: "order_c" } }
        ],
        orderBy: [
          { fieldName: "order_c", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching categories:", error.message);
        throw error;
      }
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "task_count_c" } },
          { field: { Name: "order_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [
          {
            Name: categoryData.Name,
            color_c: categoryData.color_c,
            icon_c: categoryData.icon_c,
            task_count_c: categoryData.task_count_c || 0,
            order_c: categoryData.order_c || Date.now()
          }
        ]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create category');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating category:", error.message);
        throw error;
      }
    }
  },

  async update(id, categoryData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (categoryData.Name !== undefined) updateData.Name = categoryData.Name;
      if (categoryData.color_c !== undefined) updateData.color_c = categoryData.color_c;
      if (categoryData.icon_c !== undefined) updateData.icon_c = categoryData.icon_c;
      if (categoryData.task_count_c !== undefined) updateData.task_count_c = categoryData.task_count_c;
      if (categoryData.order_c !== undefined) updateData.order_c = categoryData.order_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to update category');
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating category:", error.message);
        throw error;
      }
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to delete category');
        }
        
        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting category:", error.message);
        throw error;
      }
    }
  },

  async updateTaskCount(categoryId, increment) {
    try {
      const category = await this.getById(categoryId);
      if (!category) return null;

      const newCount = Math.max(0, (category.task_count_c || 0) + increment);
      
      return await this.update(categoryId, {
        task_count_c: newCount
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task count:", error?.response?.data?.message);
      } else {
        console.error("Error updating task count:", error.message);
      }
      return null;
    }
  }
};