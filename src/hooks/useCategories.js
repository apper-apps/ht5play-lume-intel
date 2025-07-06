import { useState, useEffect } from 'react'
import { categoryService } from '@/services/api/categoryService'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(err.message || 'Failed to load categories')
      console.error('Categories loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  function getCategoryById(id) {
    return categories.find(cat => cat.id === parseInt(id))
  }

  function getCategoryBySlug(slug) {
    return categories.find(cat => cat.slug === slug)
  }

  function getCategoriesWithGames() {
    return categories.filter(cat => cat.game_count > 0)
  }

  function getPopularCategories(limit = 5) {
    return categories
      .sort((a, b) => (b.game_count || 0) - (a.game_count || 0))
      .slice(0, limit)
  }

  async function refreshCategories() {
    await loadCategories()
  }

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryBySlug,
    getCategoriesWithGames,
    getPopularCategories,
    refreshCategories
  }
}

export function useCategory(categoryId) {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (categoryId) {
      loadCategory()
    }
  }, [categoryId])

  async function loadCategory() {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getCategoryById(categoryId)
      setCategory(data)
    } catch (err) {
      setError(err.message || 'Failed to load category')
      console.error('Category loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    category,
    loading,
    error,
    refresh: loadCategory
  }
}

export function useCategoryBySlug(slug) {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      loadCategory()
    }
  }, [slug])

  async function loadCategory() {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getCategoryBySlug(slug)
      setCategory(data)
    } catch (err) {
      setError(err.message || 'Failed to load category')
      console.error('Category loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    category,
    loading,
    error,
    refresh: loadCategory
  }
}