import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      if (!user) {
        toast.error("You must be logged in to update your profile");
        return;
      }

      if (!username.trim()) {
        toast.error("Username cannot be empty");
        return;
      }

      const updates = {
        id: user.id,
        username: username.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to update profile");
      }
      
      // Update the profile in the context
      const updatedProfile = { ...profile, username: username.trim(), avatar_url: avatarUrl };
      window.dispatchEvent(new CustomEvent('profile-updated', { 
        detail: updatedProfile 
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      if (!user) {
        toast.error("You must be logged in to upload an avatar");
        return;
      }

      // Make sure the file path includes the user ID to match the storage policy
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // First, try to delete the old avatar if it exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from("avatars")
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload the new avatar
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message || "Failed to upload avatar");
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw new Error(updateError.message || "Failed to update profile with new avatar");
      }

      // Update the profile in the context
      const updatedProfile = { ...profile, avatar_url: publicUrl };
      window.dispatchEvent(new CustomEvent('profile-updated', { 
        detail: updatedProfile 
      }));

      toast.success("Avatar uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const deleteUser = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to delete your account");
        return;
      }

      const { error } = await supabase.from('profiles').delete().eq('id', user.id);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to delete user");
      }

      await signOut();
      toast.success("User deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const assignRole = async (userId: string, role: AppRole): Promise<void> => {
    try {
      // Get current roles
      const { data, error } = await supabase
        .from('profiles')
        .select('roles')
        .eq('id', userId)
        .single();

      let roles = data?.roles || [];
      if (!roles.includes(role)) {
        roles.push(role);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ roles })
        .eq('id', userId);

      if (updateError) throw updateError;
      toast.success(`${role} role assigned successfully`);
    } catch (error: any) {
      toast.error(`Failed to assign ${role} role: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Profile Settings
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Manage your profile information here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarUrl} alt="Avatar" />
                <AvatarFallback>
                  {profile?.username?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
                >
                  {uploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </>
                  )}
                </Label>
                <Input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </div>
            </div>
            {/* Show user roles if available */}
            {profile?.roles && Array.isArray(profile.roles) && (
              <div className="text-center text-sm text-gray-600">
                <strong>Roles:</strong> {profile.roles.join(', ')}
              </div>
            )}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Button onClick={updateProfile} disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button onClick={deleteUser}>
                Delete User
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
