
import { useState } from 'react';
import { LogIn, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailLoginForm from './EmailLoginForm';
import PhoneLoginForm from './PhoneLoginForm';

type LoginMethod = 'email' | 'phone';

const LoginTabs = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  return (
    <Tabs 
      defaultValue="email" 
      className="w-full" 
      onValueChange={(value) => setLoginMethod(value as LoginMethod)}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="email" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Email
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="email">
        <EmailLoginForm />
      </TabsContent>
      
      <TabsContent value="phone">
        <PhoneLoginForm />
      </TabsContent>
    </Tabs>
  );
};

export default LoginTabs;
