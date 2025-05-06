
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, Profile } from '../types';
import { toast } from 'sonner';
import { fetchUserProfile, fetchUserRoles } from '../authUtils';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>(['user']);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

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

  return {
    session,
    user,
    profile,
    userRoles,
    isAdmin,
    loading,
  };
};
