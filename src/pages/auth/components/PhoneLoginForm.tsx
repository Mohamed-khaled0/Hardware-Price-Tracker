
import { useState } from 'react';
import { Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useAuth } from '@/contexts/auth';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number is required').regex(/^\+?[0-9\s\-()]{10,15}$/, 'Invalid phone number'),
});

const otpSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  token: z.string().min(6, 'Verification code is required'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const PhoneLoginForm = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { signInWithPhone, verifyOTP, loading } = useAuth();

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

  const onSubmitPhone = async (values: PhoneFormValues) => {
    try {
      await signInWithPhone(values.phone);
      setPhoneNumber(values.phone);
      setShowOtpInput(true);
      otpForm.setValue('phone', values.phone);
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

  return (
    <>
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
    </>
  );
};

export default PhoneLoginForm;
