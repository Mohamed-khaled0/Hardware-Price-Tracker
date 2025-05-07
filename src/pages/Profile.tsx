
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AvatarUpload from "@/components/profile/AvatarUpload";
import ProfileForm from "@/components/profile/ProfileForm";

const Profile: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");

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

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
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
            {user && (
              <AvatarUpload 
                userId={user.id} 
                initialAvatarUrl={avatarUrl} 
                onAvatarChange={handleAvatarChange}
                username={profile?.username}
                email={user.email}
              />
            )}
            <Separator />
            <ProfileForm 
              userId={user?.id || ''} 
              initialUsername={username} 
              initialAvatarUrl={avatarUrl}
              profile={profile}
              onSignOut={handleSignOut}
            />
          </CardContent>
          <CardFooter>
            {/* CardFooter is kept for layout consistency but content moved to ProfileForm */}
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
