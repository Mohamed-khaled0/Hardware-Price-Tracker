
import { User, Session } from '@supabase/supabase-js';

export type AppRole = 'admin' | 'user';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  blocked?: boolean;
}
