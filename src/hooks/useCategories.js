import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../lib/constants';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Fallback to default constants formatted as category objects
        const defaults = [
          ...DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c, type: 'expense' })),
          ...DEFAULT_INCOME_CATEGORIES.map((c) => ({ ...c, type: 'income' }))
        ];
        setCategories(defaults);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async ({ name, type, icon }) => {
    if (!user) return;
    try {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error('Category name cannot be empty');
      }

      // Check if category already exists (case-insensitive) for the same type
      const isDuplicate = categories.some(
        (c) => c.type === type && c.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        throw new Error(`Category "${trimmedName}" already exists as an ${type} category.`);
      }

      const newCat = {
        user_id: user.id,
        name: trimmedName,
        type,
        icon: icon || (type === 'expense' ? 'Tag' : 'DollarSign')
      };

      const { data, error } = await supabase
        .from('categories')
        .insert(newCat)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error(`Category "${trimmedName}" already exists.`);
        }
        throw error;
      }
      setCategories((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    refetchCategories: fetchCategories,
    addCategory,
    deleteCategory
  };
}
