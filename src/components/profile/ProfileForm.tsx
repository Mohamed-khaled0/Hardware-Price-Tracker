
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  userId: string;
  initialUsername: string;
  initialAvatarUrl: string;
  profile: any; // Using any for now as we don't have the full profile type
  onSignOut: () => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  initialUsername,
  initialAvatarUrl,
  profile,
  onSignOut
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      if (!userId) throw new Error("Not authenticated");

      const updates = {
        id: userId,
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      
      // Update the profile in the context
      const updatedProfile = { ...profile, username, avatar_url: avatarUrl };
      // Since we can't directly update the context, we're using this hack
      // to force a refresh of the profile data in the header
      window.dispatchEvent(new CustomEvent('profile-updated', { 
        detail: updatedProfile 
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex justify-between w-full">
        <Button variant="destructive" onClick={onSignOut}>
          Sign Out
        </Button>
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </>
  );
};

export default ProfileForm;
