
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
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
import { FcGoogle } from "react-icons/fc";
import { Phone } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number is required').regex(/^\+?[0-9\s\-()]{10,15}$/, 'Invalid phone number'),
});

const otpSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  token: z.string().min(6, 'Verification code is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithPhone, verifyOTP, user, loading } = useAuth();
  
  // If already logged in, redirect to homepage
  if (user) {
    navigate('/');
    return null;
  }
  
  const emailForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: phoneNumber,
      token: '',
    },
  });

  const onSubmitEmail = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled in the AuthContext
    }
  };

  const onSubmitPhone = async (values: PhoneFormValues) => {
    try {
      await signInWithPhone(values.phone);
      setPhoneNumber(values.phone);
      setShowOtpInput(true);
    } catch (error) {
      console.error('Phone login error:', error);
      // Error is handled in the AuthContext
    }
  };

  const onSubmitOTP = async (values: OTPFormValues) => {
    try {
      await verifyOTP(values.phone, values.token);
    } catch (error) {
      console.error('OTP verification error:', error);
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
            
            <Tabs 
              defaultValue="email" 
              className="w-full" 
              onValueChange={(value) => {
                setLoginMethod(value as 'email' | 'phone');
                setShowOtpInput(false);
              }}
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
                              placeholder="Insert Email Address Here" 
                              className="w-full bg-gray-200 border-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
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
                    
                    <div className="flex flex-col space-y-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center justify-center gap-2 w-full"
                        onClick={handleGoogleSignIn}
                      >
                        <FcGoogle size={20} />
                        Sign in with Google
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="phone">
                {!showOtpInput ? (
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
                                placeholder="+1 234 567 8900" 
                                className="w-full bg-gray-200 border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full py-6 bg-[#39536f] hover:bg-[#2a405a]"
                        disabled={loading}
                      >
                        <Phone className="mr-2 h-5 w-5" /> {loading ? 'Sending code...' : 'Send verification code'}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-6">
                      <FormField
                        control={otpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                disabled
                                className="w-full bg-gray-200 border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={otpForm.control}
                        name="token"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Verification Code</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                placeholder="Enter the code sent to your phone" 
                                className="w-full bg-gray-200 border-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowOtpInput(false);
                            setPhoneNumber('');
                          }}
                        >
                          Change Phone
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-[#39536f] hover:bg-[#2a405a]"
                          disabled={loading}
                        >
                          {loading ? 'Verifying...' : 'Verify & Login'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-6">
              <span className="text-gray-600">Don't Have An Account? </span>
              <Link to="/signup" className="text-[#39536f] hover:underline font-medium">
                Sign Up
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

export default Login;
