'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Define a type for the stored todo item
interface StoredTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // Date stored as string in JSON
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        // Parse the stored JSON and convert string dates back to Date objects
        const parsedTodos = JSON.parse(storedTodos).map((todo: StoredTodo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: uuidv4(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  // Toggle todo completion status
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start editing a todo
  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  // Save edited todo
  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      setTodos(
        todos.map(todo =>
          todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
        )
      );
      setEditingId(null);
      setEditValue('');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800">
          <h1 className="text-2xl font-bold text-white text-center">My Todo List</h1>
        </div>
        
        {/* Add Todo Form */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              aria-label="Add a new task"
              id="new-task-input"
              autoComplete="off"
              style={{ zIndex: 10 }}
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md transition-colors"
              aria-label="Add task"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 p-2 text-center ${filter === 'all' ? 'bg-blue-100 dark:bg-blue-900 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 p-2 text-center ${filter === 'active' ? 'bg-blue-100 dark:bg-blue-900 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 p-2 text-center ${filter === 'completed' ? 'bg-blue-100 dark:bg-blue-900 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            Completed
          </button>
        </div>
        
        {/* Todo List */}
        <ul className="divide-y dark:divide-gray-700">
          {filteredTodos.length === 0 ? (
            <li className="p-4 text-center text-gray-500 dark:text-gray-400">
              No tasks found
            </li>
          ) : (
            filteredTodos.map(todo => (
              <li key={todo.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {editingId === todo.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span 
                        className={`${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                        disabled={todo.completed}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <span>{todos.filter(t => !t.completed).length} items left</span>
          <button
            onClick={clearCompleted}
            className="hover:underline"
            disabled={!todos.some(t => t.completed)}
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}
