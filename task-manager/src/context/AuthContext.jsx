import { createContext, useContext, useState, useEffect } from 'react';
import { authService, profileService } from '../firebase/services';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribed = false;

    const unsubscribe = authService.subscribe((firebaseUser) => {
      if (unsubscribed) return;
      
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          avatar: firebaseUser.photoURL
        });
        
        const unsubProfile = profileService.subscribeToProfile(firebaseUser.uid, (profileData) => {
          if (!unsubscribed) {
            setProfile(profileData);
            // Always sync avatar from profile to user state
            if (profileData?.avatar) {
              setUser(prev => prev ? { ...prev, avatar: profileData.avatar } : null);
            }
          }
        });
        
        setLoading(false);
        
        return () => {
          unsubProfile();
        };
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      unsubscribed = true;
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email, password) => {
    const firebaseUser = await authService.login(email, password);
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      avatar: firebaseUser.photoURL
    };
  };

  const signup = async (name, email, password) => {
    const firebaseUser = await authService.signup(name, email, password);
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: name,
      avatar: null
    };
  };

  const loginWithGoogle = async () => {
    const firebaseUser = await authService.signInWithGoogle();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      avatar: firebaseUser.photoURL
    };
  };

  const logout = async () => {
    await authService.logout();
  };

  const updateProfile = async (updates) => {
    if (user) {
      // Update Firebase Auth profile
      if (updates.name) {
        await authService.updateUserProfile({ displayName: updates.name });
        setUser(prev => ({ ...prev, name: updates.name }));
      }
      
      if (updates.avatar) {
        // Store avatar in database only (Firebase Auth has size limits)
        await profileService.updateProfile(user.id, { avatar: updates.avatar });
        setUser(prev => ({ ...prev, avatar: updates.avatar }));
      } else if (updates.avatar === null) {
        // Remove avatar
        await profileService.updateProfile(user.id, { avatar: null });
        setUser(prev => ({ ...prev, avatar: null }));
      }
      
      // Update database profile for other fields
      const dbUpdates = { ...updates };
      delete dbUpdates.name;
      delete dbUpdates.avatar;
      if (Object.keys(dbUpdates).length > 0) {
        await profileService.updateProfile(user.id, dbUpdates);
      }
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    await authService.changePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      loading, 
      login, 
      loginWithGoogle,
      signup, 
      logout, 
      updateProfile,
      changePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
