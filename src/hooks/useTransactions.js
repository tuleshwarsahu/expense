import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useTransactions(filters = {}) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      // Filtering by type
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      // Filtering by category
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      // Filtering by date range / presets
      if (filters.datePreset && filters.datePreset !== 'all') {
        const now = new Date();
        let startDate;

        if (filters.datePreset === 'week') {
          const dayOfWeek = now.getDay();
          const distanceToMonday = (dayOfWeek + 6) % 7;
          startDate = new Date(now);
          startDate.setDate(now.getDate() - distanceToMonday);
          startDate.setHours(0, 0, 0, 0);
          query = query.gte('transaction_date', startDate.toISOString().split('T')[0]);
        } else if (filters.datePreset === 'month') {
          if (filters.startDate && filters.endDate) {
            query = query
              .gte('transaction_date', filters.startDate)
              .lte('transaction_date', filters.endDate);
          } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            query = query
              .gte('transaction_date', startDate.toISOString().split('T')[0])
              .lte('transaction_date', endDate.toISOString().split('T')[0]);
          }
        } else if (filters.datePreset === 'year') {
          startDate = new Date(now.getFullYear(), 0, 1);
          query = query.gte('transaction_date', startDate.toISOString().split('T')[0]);
        } else if (filters.datePreset === 'custom') {
          if (filters.startDate) {
            query = query.gte('transaction_date', filters.startDate);
          }
          if (filters.endDate) {
            query = query.lte('transaction_date', filters.endDate);
          }
        }
      }

      // Search term (category or description)
      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'newest';
      if (sortBy === 'newest') {
        query = query.order('transaction_date', { ascending: false }).order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('transaction_date', { ascending: true }).order('created_at', { ascending: true });
      } else if (sortBy === 'highest') {
        query = query.order('amount', { ascending: false });
      } else if (sortBy === 'lowest') {
        query = query.order('amount', { ascending: true });
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [user, filters.type, filters.category, filters.datePreset, filters.startDate, filters.endDate, filters.search, filters.sortBy]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Create Transaction
  const addTransaction = async (newTx) => {
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        type: newTx.type,
        amount: parseFloat(newTx.amount),
        category: newTx.category,
        description: newTx.description || '',
        transaction_date: newTx.transaction_date || new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      setTransactions((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  // Update Transaction
  const updateTransaction = async (id, updates) => {
    if (!user) return;
    try {
      const payload = {
        type: updates.type,
        amount: parseFloat(updates.amount),
        category: updates.category,
        description: updates.description || '',
        transaction_date: updates.transaction_date,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setTransactions((prev) => prev.map((tx) => (tx.id === id ? data : tx)));
      return data;
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    refetchTransactions: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
}
