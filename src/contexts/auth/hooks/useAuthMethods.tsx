
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthMethods = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return {
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyOTP,
    signOut,
    resetPassword,
    resetPasswordWithPhone,
  };
};
