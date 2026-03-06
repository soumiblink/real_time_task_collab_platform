import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user, profile, updateProfile, changePassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(() => {
    // Try to load from localStorage on initial render
    return localStorage.getItem('easemytask_avatar') || null;
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Always sync avatar from profile or user to local state
    let loadedAvatar = null;
    
    if (profile?.avatar) {
      loadedAvatar = profile.avatar;
    } else if (user?.avatar) {
      loadedAvatar = user.avatar;
    } else {
      const localAvatar = localStorage.getItem('easemytask_avatar');
      if (localAvatar) {
        loadedAvatar = localAvatar;
      }
    }
    
    setName(profile?.name || user?.name || '');
    setAvatar(loadedAvatar || '');
  }, [profile, user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB for Firebase Realtime DB)
      if (file.size > 1024 * 1024) {
        setError('Image size must be less than 1MB');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateProfile({ avatar: reader.result });
          setAvatar(reader.result);
          localStorage.setItem('easemytask_avatar', reader.result);
          setMessage('Profile photo updated!');
        } catch (_err) {
          localStorage.setItem('easemytask_avatar', reader.result);
          setAvatar(reader.result);
          setMessage('Profile photo updated! (saved locally)');
        }
      };
      reader.onerror = () => {
        setError('Failed to read image file');
        setTimeout(() => setError(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setAvatar('');
      localStorage.removeItem('easemytask_avatar');
      await updateProfile({ avatar: null });
      setMessage('Profile photo removed!');
    } catch (_err) {
      localStorage.removeItem('easemytask_avatar');
      setMessage('Profile photo removed! (saved locally)');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateProfile({ name });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
    
    setSaving(false);
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setSaving(false);
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setError('Current password is incorrect');
      } else {
        setError(err.message || 'Failed to update password');
      }
    }
    
    setSaving(false);
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account settings and personal preferences.</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal details and how others see you.</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-primary">{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">camera_alt</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-slate-800 dark:text-white">Profile Photo</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, GIF or PNG. Max size of 2MB.</p>
                <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Upload New
                  </button>
                  {avatar && (
                    <button 
                      onClick={handleRemoveImage}
                      className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end border-t border-slate-200 dark:border-slate-800 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Keep your account secure with regular password updates.</p>
          </div>
          <form onSubmit={handleChangePassword} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Password must be at least 6 characters long.
            </p>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !currentPassword || !newPassword}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>

        {/* Theme Preference Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Theme Preference</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Customize your interface experience.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl ${theme === 'light' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>light_mode</span>
                <span className={`text-sm font-bold ${theme === 'light' ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>Light Mode</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl ${theme === 'dark' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>dark_mode</span>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>Dark Mode</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  theme === 'system'
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl ${theme === 'system' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>devices</span>
                <span className={`text-sm font-bold ${theme === 'system' ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>System</span>
              </button>
            </div>
          </div>
        </section>

        {/* Account Management */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-red-100 dark:border-red-900">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Permanent actions that cannot be undone.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-white">Deactivate Account</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This will temporarily disable your account and remove your profile from search results.</p>
              </div>
              <button className="px-6 py-2.5 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap">Deactivate</button>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-white">Delete Account</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-red-900/30 whitespace-nowrap">Delete Permanently</button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center text-sm text-slate-400 dark:text-slate-500 pb-8">
        <p>EaseMyTask v1.0.0 • Made with ❤️</p>
      </div>
    </div>
  );
}
