
import React, { ReactNode, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from './AuthContext';
import { AppRole, Profile, UserWithRole } from './types';
import { 
  fetchUserProfile, 
  fetchUserRoles, 
  getUserList, 
  deleteUser, 
  blockUser,
  assignRole as assignUserRole,
  removeRole as removeUserRole
} from './authUtils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>(['user']);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Fetch user profile using setTimeout to prevent Supabase auth deadlock
          setTimeout(() => {
            fetchUserProfile(newSession.user.id).then(profileData => {
              if (profileData) {
                setProfile(profileData);
              }
            });
            
            // Fetch user roles
            fetchUserRoles(newSession.user.id).then(roles => {
              setUserRoles(roles);
              setIsAdmin(roles.includes('admin'));
            });
          }, 0);
        } else {
          setProfile(null);
          setUserRoles(['user']);
          setIsAdmin(false);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
        } else if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user.id).then(profileData => {
          if (profileData) {
            setProfile(profileData);
          }
        });
        
        // Fetch user roles
        fetchUserRoles(existingSession.user.id).then(roles => {
          setUserRoles(roles);
          setIsAdmin(roles.includes('admin'));
        });
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'An error occurred during sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'An error occurred during sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'An error occurred during Google sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Verification code sent to your phone. Please check your messages.');
    } catch (error: any) {
      console.error('Error signing in with phone:', error);
      toast.error(error.message || 'An error occurred during phone verification');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Phone verified successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'An error occurred during verification');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'An error occurred during sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'An error occurred during password reset');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordWithPhone = async (phone: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Password reset code sent to your phone. Please enter the code to reset your password.');
    } catch (error: any) {
      console.error('Error resetting password with phone:', error);
      toast.error(error.message || 'An error occurred during phone verification');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    userRoles,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyOTP,
    signOut,
    resetPassword,
    resetPasswordWithPhone,
    loading,
    // Admin functions
    getUserList,
    deleteUser,
    blockUser,
    assignRole: assignUserRole,
    removeRole: removeUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
