
import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetPasswordWithPhone: (phone: string) => Promise<void>;
  loading: boolean;
}
