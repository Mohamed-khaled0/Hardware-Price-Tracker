
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    // In a real app, this would call an API to request a password reset
    console.log('Password reset request for:', values);
    
    // Simulate successful password reset request
    toast.success('Password reset email sent! Please check your inbox.');
    
    // Navigate to login page after short delay
    setTimeout(() => {
      navigate('/login');
    }, 2000);
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
              Don't Worry! It Happens. Please Enter The Email Associated With Your Account.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Username Or Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="Username Or Email" 
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
                >
                  Reset Password
                </Button>
                
                <div className="text-center">
                  <span className="text-gray-600">Remembered Password? </span>
                  <Link to="/login" className="text-[#39536f] hover:underline font-medium">
                    Log In
                  </Link>
                </div>
              </form>
            </Form>
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
