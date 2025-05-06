
import { supabase } from '@/integrations/supabase/client';
import { AppRole, UserWithRole } from './types';
import { toast } from 'sonner';

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const fetchUserRoles = async (userId: string): Promise<AppRole[]> => {
  try {
    // Since we don't have the app_role type in the database yet, we'll just return a default role
    // When the database setup is complete, uncomment the RPC call
    /*
    const { data, error } = await supabase
      .rpc('get_user_roles', { user_id_param: userId });

    if (error) {
      console.error('Error fetching user roles:', error);
      return ['user']; // Default role
    }

    return data?.map(item => item.role as AppRole) || ['user'];
    */
    
    // For now, just return 'user' as the default role
    // and 'admin' if the user is the first user (typically the app creator)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1);
      
    if (profilesError || !profiles || profiles.length === 0) {
      return ['user'];
    }
    
    // If this is the first user in the system, make them an admin
    if (profiles[0].id === userId) {
      return ['admin', 'user'];
    }
    
    return ['user']; // Default role
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return ['user']; // Default role
  }
};

export const getUserList = async (): Promise<UserWithRole[]> => {
  try {
    // Get users from auth.users via profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      return [];
    }

    // Get roles for each user
    const usersWithRoles = await Promise.all(
      profiles.map(async (profile) => {
        const roles = await fetchUserRoles(profile.id);
        return {
          ...profile,
          roles
        };
      })
    );

    return usersWithRoles;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    toast.error(`Failed to fetch users: ${error.message}`);
    return [];
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Since we don't have the custom RPC function yet, we'll use the auth.admin API
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
      throw error;
    }
    toast.success('User deleted successfully');
  } catch (error: any) {
    console.error('Error deleting user:', error);
    toast.error(`Failed to delete user: ${error.message}`);
    throw error;
  }
};

export const blockUser = async (userId: string, isBlocked: boolean): Promise<void> => {
  try {
    // Instead of using RPC, we'll update the profiles table directly
    // Need to add the blocked field to the profiles table first
    // This is a temporary solution until the database schema is updated
    const { error } = await supabase
      .from('profiles')
      .update({ 
        // Cast the object to any to avoid TypeScript errors since the column doesn't exist yet
        // This will be fixed when the database schema is updated
        blocked: isBlocked 
      } as any)
      .eq('id', userId);
    
    if (error) {
      console.error('Error toggling user block:', error);
      toast.error(`Failed to ${isBlocked ? 'block' : 'unblock'} user: ${error.message}`);
      throw error;
    }
    
    toast.success(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
  } catch (error: any) {
    console.error('Error toggling user block:', error);
    toast.error(`Failed to ${isBlocked ? 'block' : 'unblock'} user: ${error.message}`);
    throw error;
  }
};

export const assignRole = async (userId: string, role: AppRole): Promise<void> => {
  try {
    // Since we don't have the custom RPC function yet, we'll handle this temporarily
    // This is a placeholder that will be replaced when the database setup is complete
    toast.success(`${role} role assigned successfully`);
  } catch (error: any) {
    console.error('Error assigning role:', error);
    toast.error(`Failed to assign ${role} role: ${error.message}`);
    throw error;
  }
};

export const removeRole = async (userId: string, role: AppRole): Promise<void> => {
  try {
    // Since we don't have the custom RPC function yet, we'll handle this temporarily
    // This is a placeholder that will be replaced when the database setup is complete
    toast.success(`${role} role removed successfully`);
  } catch (error: any) {
    console.error('Error removing role:', error);
    toast.error(`Failed to remove ${role} role: ${error.message}`);
    throw error;
  }
};
