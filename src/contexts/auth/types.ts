
import { Session, User } from '@supabase/supabase-js';

export type AppRole = 'admin' | 'user';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

export interface UserWithRole extends Profile {
  roles: AppRole[];
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  userRoles: AppRole[];
  isAdmin: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetPasswordWithPhone: (phone: string) => Promise<void>;
  loading: boolean;
  // Admin functions
  getUserList: () => Promise<UserWithRole[]>;
  deleteUser: (userId: string) => Promise<void>;
  blockUser: (userId: string, isBlocked: boolean) => Promise<void>;
  assignRole: (userId: string, role: AppRole) => Promise<void>;
  removeRole: (userId: string, role: AppRole) => Promise<void>;
}
