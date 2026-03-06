import { useState, useEffect, useRef } from 'react';
import { useGoals } from '../context/GoalContext';
import { useTasks } from '../context/TaskContext';

export default function GoalModal({ isOpen, onClose, goal }) {
  const { addGoal, updateGoal, deleteGoal } = useGoals();
  const { getTasksByGoal } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'Personal',
    imageUrl: '',
    progress: 0,
  });

  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        deadline: goal.deadline || '',
        category: goal.category || 'Personal',
        imageUrl: goal.imageUrl || '',
        progress: goal.progress || 0,
      });
      setImagePreview(goal.imageUrl || '');
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        category: 'Personal',
        imageUrl: '',
        progress: 0,
      });
      setImagePreview('');
    }
  }, [goal, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      // Create a fake URL for the uploaded image (in real app, upload to server/storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, imageUrl: reader.result });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleProgressChange = (increment) => {
    const newProgress = Math.min(100, Math.max(0, formData.progress + increment));
    setFormData({ ...formData, progress: newProgress });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.deadline) return;

    if (goal) {
      updateGoal(goal.id, formData);
    } else {
      addGoal(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (goal && confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goal.id);
      onClose();
    }
  };

  const categories = [
    { name: 'Personal', icon: 'person' },
    { name: 'Work', icon: 'work' },
    { name: 'Skill-Up', icon: 'school' },
    { name: 'Health', icon: 'fitness_center' },
    { name: 'Finance', icon: 'account_balance' },
    { name: 'Active', icon: 'sports' },
  ];

  if (!isOpen) return null;

  // Get linked tasks if editing
  const linkedTasks = goal ? getTasksByGoal(goal.id) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {goal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <div className="flex items-center gap-2">
              {goal && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Cover Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">image</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="goal-image"
                />
                <label
                  htmlFor="goal-image"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                  {uploading ? 'Uploading...' : 'Choose Image'}
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Enter goal title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Describe your goal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <div className="relative" ref={categoryRef}>
                <button
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:ring-2 focus:ring-primary flex items-center justify-between text-slate-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      {categories.find(c => c.name === formData.category)?.icon || 'category'}
                    </span>
                    {formData.category}
                  </span>
                  <span className="material-symbols-outlined text-slate-400">
                    {categoryOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {categoryOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: cat.name });
                          setCategoryOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          formData.category === cat.name ? 'bg-primary/10 text-primary font-medium' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Progress: {formData.progress}%
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleProgressChange(-10)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => handleProgressChange(10)}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {/* Linked Tasks Info */}
          {linkedTasks.length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold">{linkedTasks.length}</span> tasks linked to this goal
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {goal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
