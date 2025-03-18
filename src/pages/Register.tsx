
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function Register() {
  const footer = (
    <div className="text-center w-full text-sm text-bookswap-brown">
      Already have an account?{' '}
      <Link 
        to="/login" 
        className="font-medium text-bookswap-secondary hover:text-bookswap-secondary/90 transition-colors"
      >
        Log in
      </Link>
    </div>
  );

  return (
    <AuthLayout
      title="Create Your Account"
      description="Join our community of book lovers and start swapping"
      footer={footer}
    >
      <RegisterForm onSubmit={async () => {}} />
    </AuthLayout>
  );
}
