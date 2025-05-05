import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Facebook } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/auth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithFacebook, user, loading } = useAuth();
  
  // If already logged in, redirect to homepage
  if (user) {
    navigate('/');
    return null;
  }
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled in the AuthContext
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      console.error('Facebook sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row">
          {/* Left Side - Form */}
          <div className="flex-1 md:pr-8">
            <h1 className="text-4xl font-bold mb-2">Log In</h1>
            <p className="text-lg text-gray-700 mb-8">
              Log Into Your Account And Enjoy A Faster Checkout.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Username Or Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Insert Username / Email Address Here" 
                          className="w-full bg-gray-200 border-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="****************"
                            className="w-full bg-gray-200 border-0 pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-right">
                  <Link to="/forgot-password" className="text-gray-600 hover:text-[#39536f] hover:underline">
                    Lost Your Password?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-5 w-5" /> {loading ? 'Logging in...' : 'Log In'}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full py-6"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Google className="mr-2 h-5 w-5" /> Google
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full py-6"
                    onClick={handleFacebookSignIn}
                    disabled={loading}
                  >
                    <Facebook className="mr-2 h-5 w-5" /> Facebook
                  </Button>
                </div>
                
                <div className="text-center">
                  <span className="text-gray-600">Don't Have An Account? </span>
                  <Link to="/signup" className="text-[#39536f] hover:underline font-medium">
                    Sign Up
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

export default Login;
