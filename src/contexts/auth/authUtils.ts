
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
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user roles:', error);
      return ['user']; // Default role
    }

    return data.map(row => row.role as AppRole);
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
    const { error } = await supabase.rpc('delete_user', { user_id_param: userId });
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
    const { error } = await supabase.rpc('toggle_user_block', {
      user_id_param: userId,
      is_blocked: isBlocked
    });
    
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
    const { error } = await supabase.rpc('assign_role', {
      user_id_param: userId,
      role_param: role
    });
    
    if (error) {
      console.error('Error assigning role:', error);
      toast.error(`Failed to assign ${role} role: ${error.message}`);
      throw error;
    }
    
    toast.success(`${role} role assigned successfully`);
  } catch (error: any) {
    console.error('Error assigning role:', error);
    toast.error(`Failed to assign ${role} role: ${error.message}`);
    throw error;
  }
};

export const removeRole = async (userId: string, role: AppRole): Promise<void> => {
  try {
    const { error } = await supabase.rpc('remove_role', {
      user_id_param: userId,
      role_param: role
    });
    
    if (error) {
      console.error('Error removing role:', error);
      toast.error(`Failed to remove ${role} role: ${error.message}`);
      throw error;
    }
    
    toast.success(`${role} role removed successfully`);
  } catch (error: any) {
    console.error('Error removing role:', error);
    toast.error(`Failed to remove ${role} role: ${error.message}`);
    throw error;
  }
};
