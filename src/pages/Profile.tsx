
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  avatar_url: z.string().url('Please provide a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Initialize form with default values - we'll update them when profile data is available
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      avatar_url: '',
    },
  });
  
  // Use useEffect to handle redirection and form value updates
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Update form values when profile data is available
    if (profile) {
      form.reset({
        username: profile.username || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [user, profile, navigate, form]);

  // If we're redirecting, don't render the rest of the component
  if (!user) {
    return null;
  }

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          avatar_url: values.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#39536f]">My Profile</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-8">
            <Avatar className="h-20 w-20 mr-4">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
              <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile?.username || user.email}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Username</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="Username" 
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="avatar_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Avatar URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="https://example.com/avatar.jpg" 
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#39536f] hover:bg-[#2a405a]"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
