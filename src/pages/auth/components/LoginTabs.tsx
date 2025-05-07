
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from './EmailLoginForm';

const LoginTabs = () => {
  return (
    <div className="w-full">
      <EmailLoginForm />
    </div>
  );
};

export default LoginTabs;
