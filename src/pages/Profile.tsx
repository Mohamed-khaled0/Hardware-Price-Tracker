
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Image, Upload, Facebook, Google } from 'lucide-react';

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
  // We'll handle file upload separately, so the avatar_url can be optional
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    }
  }, [user, profile, navigate, form]);

  // If we're redirecting, don't render the rest of the component
  if (!user) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setAvatarFile(file);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // If there's a new avatar file, upload it first
      let avatarUrl = values.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          avatar_url: avatarUrl || null,
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#39536f]">My Profile</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
              <Avatar className="h-24 w-24 mb-2">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt={profile?.username || 'User'} />
                ) : (
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                )}
                <AvatarFallback className="text-xl">
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button 
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change Avatar
            </button>
            <div className="mt-2 text-center">
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Connect Social Accounts</h3>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={() => toast.info("Google authentication will be connected soon")} 
                variant="outline" 
                className="flex items-center justify-center space-x-2"
              >
                <Google className="h-5 w-5" />
                <span>Connect Google</span>
              </Button>
              
              <Button 
                onClick={() => toast.info("Facebook authentication will be connected soon")} 
                variant="outline" 
                className="flex items-center justify-center space-x-2"
              >
                <Facebook className="h-5 w-5" />
                <span>Connect Facebook</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
