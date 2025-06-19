
import { LogIn } from 'lucide-react';
import EmailLoginForm from './EmailLoginForm';

const LoginTabs = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <LogIn className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Sign in with Email</h2>
      </div>
      <EmailLoginForm />
    </div>
  );
};

export default LoginTabs;
