import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/auth';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number is required').regex(/^\+?[0-9\s\-()]{10,15}$/, 'Invalid phone number'),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

const ForgotPassword = () => {
  const { resetPassword, resetPasswordWithPhone, loading } = useAuth();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmitEmail = async (values: EmailFormValues) => {
    try {
      await resetPassword(values.email);
      // Success message is handled in the AuthContext
    } catch (error) {
      console.error('Password reset error:', error);
      // Error is handled in the AuthContext
    }
  };

  const onSubmitPhone = async (values: PhoneFormValues) => {
    try {
      await resetPasswordWithPhone(values.phone);
      // Success message is handled in the AuthContext
    } catch (error) {
      console.error('Password reset error:', error);
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 md:pr-8">
            <h1 className="text-4xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-lg text-gray-700 mb-8">
              Don't Worry! It Happens. Please Enter The Email Or Phone Associated With Your Account.
            </p>
            
            <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setMethod(value as 'email' | 'phone')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="Enter your email address" 
                              className="w-full bg-gray-200 border-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p>We Will Send You An Email To Reset Your Password.</p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
                      disabled={loading}
                    >
                      {loading ? 'Sending Reset Link...' : 'Reset Password'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="phone">
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-6">
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="Enter your phone number (with country code)" 
                              className="w-full bg-gray-200 border-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p>We Will Send You A Verification Code To Reset Your Password.</p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
                      disabled={loading}
                    >
                      {loading ? 'Sending Code...' : 'Send Verification Code'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-6">
              <span className="text-gray-600">Remembered Password? </span>
              <Link to="/login" className="text-[#39536f] hover:underline font-medium">
                Log In
              </Link>
            </div>
          </div>
          
          {/* Right Side - Image */}
          <div className="hidden md:block flex-1 mt-10 md:mt-0">
            <div className="h-full rounded-3xl overflow-hidden bg-[#dbe7f0]">
              <img 
                src="/lovable-uploads/login.webp" 
                loading="lazy"
                alt="Modern tablet device" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
