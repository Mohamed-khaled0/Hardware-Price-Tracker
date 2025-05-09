import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  username: string;
  setUsername: (username: string) => void;
  updateProfile: () => Promise<void>;
  loading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  username,
  setUsername,
  updateProfile,
  loading
}) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
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
        <Button variant="destructive" onClick={() => {}}>
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
