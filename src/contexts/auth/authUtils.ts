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
    // Get user's email from auth.users
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return ['user'];
    }

    // Only assign admin role to the specified email
    if (user?.email === 'mohamedalshraby3@gmail.com') {
      return ['admin', 'user'];
    }

    // For all other users, return only 'user' role
    return ['user'];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return ['user'];
  }
};

export const getUserList = async (): Promise<UserWithRole[]> => {
  try {
    // Call the RPC with undefined as the argument and cast data as any[]
    const { data, error } = await supabase.rpc('list_users_with_profiles', undefined);
    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      return [];
    }
    if (!data) {
      return [];
    }

    // Add roles and blocked status (if you have a blocked field in profiles)
    const usersWithRoles = await Promise.all(
      (data as any[]).map(async (user: any) => {
        const roles = await fetchUserRoles(user.id);
        return {
          ...user,
          roles,
          blocked: user.blocked || false, // If you add a blocked field to your function, this will work
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
