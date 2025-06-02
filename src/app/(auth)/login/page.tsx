'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import { RxLockClosed } from 'react-icons/rx';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { Input } from '@/components/common/Input';
import { Logo } from '@/components/common/Logo';
import { Select, SelectOption } from '@/components/common/Select';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

// List of countries
const COUNTRIES: SelectOption[] = [
  { value: 'AF', label: 'Afghanistan' },
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AO', label: 'Angola' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AM', label: 'Armenia' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'Austria' },
  { value: 'AZ', label: 'Azerbaijan' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'BB', label: 'Barbados' },
  { value: 'BY', label: 'Belarus' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BZ', label: 'Belize' },
  { value: 'BJ', label: 'Benin' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'BW', label: 'Botswana' },
  { value: 'BR', label: 'Brazil' },
  { value: 'BN', label: 'Brunei' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'BI', label: 'Burundi' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'CA', label: 'Canada' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'CL', label: 'Chile' },
  { value: 'CN', label: 'China' },
  { value: 'CO', label: 'Colombia' },
  { value: 'KM', label: 'Comoros' },
  { value: 'CG', label: 'Congo' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'HR', label: 'Croatia' },
  { value: 'CU', label: 'Cuba' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'DK', label: 'Denmark' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'DM', label: 'Dominica' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'EG', label: 'Egypt' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'EE', label: 'Estonia' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'GA', label: 'Gabon' },
  { value: 'GM', label: 'Gambia' },
  { value: 'GE', label: 'Georgia' },
  { value: 'DE', label: 'Germany' },
  { value: 'GH', label: 'Ghana' },
  { value: 'GR', label: 'Greece' },
  { value: 'GD', label: 'Grenada' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'GN', label: 'Guinea' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'GY', label: 'Guyana' },
  { value: 'HT', label: 'Haiti' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IR', label: 'Iran' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'IT', label: 'Italy' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'JP', label: 'Japan' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'KP', label: 'North Korea' },
  { value: 'KR', label: 'South Korea' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'LA', label: 'Laos' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'LR', label: 'Liberia' },
  { value: 'LY', label: 'Libya' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MK', label: 'Macedonia' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MW', label: 'Malawi' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MV', label: 'Maldives' },
  { value: 'ML', label: 'Mali' },
  { value: 'MT', label: 'Malta' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'MX', label: 'Mexico' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'MD', label: 'Moldova' },
  { value: 'MC', label: 'Monaco' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'MA', label: 'Morocco' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'NA', label: 'Namibia' },
  { value: 'NR', label: 'Nauru' },
  { value: 'NP', label: 'Nepal' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NE', label: 'Niger' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'NO', label: 'Norway' },
  { value: 'OM', label: 'Oman' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'PW', label: 'Palau' },
  { value: 'PS', label: 'Palestine' },
  { value: 'PA', label: 'Panama' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RO', label: 'Romania' },
  { value: 'RU', label: 'Russia' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'KN', label: 'Saint Kitts and Nevis' },
  { value: 'LC', label: 'Saint Lucia' },
  { value: 'VC', label: 'Saint Vincent and the Grenadines' },
  { value: 'WS', label: 'Samoa' },
  { value: 'SM', label: 'San Marino' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'SN', label: 'Senegal' },
  { value: 'RS', label: 'Serbia' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'SO', label: 'Somalia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'ES', label: 'Spain' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SR', label: 'Suriname' },
  { value: 'SZ', label: 'Swaziland' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SY', label: 'Syria' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TL', label: 'Timor-Leste' },
  { value: 'TG', label: 'Togo' },
  { value: 'TO', label: 'Tonga' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'TV', label: 'Tuvalu' },
  { value: 'UG', label: 'Uganda' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'VA', label: 'Vatican City' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' }
];

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regErrors, setRegErrors] = useState({
    regName: '',
    regSurname: '',
    regEmail: '',
    regPassword: '',
    regConfirm: ''
  });

  useEffect(() => {
    // Load Vanta.js scripts
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    threeScript.async = true;
    document.body.appendChild(threeScript);

    const vantaScript = document.createElement('script');
    vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
    vantaScript.async = true;
    document.body.appendChild(vantaScript);

    // Initialize Vanta effect after scripts are loaded
    const initVanta = () => {
      if (window.VANTA) {
        window.VANTA.NET({
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x00b4d8,
          backgroundColor: 0xffffff,
          points: 9.00,
          maxDistance: 25.00,
          spacing: 18.00,
          showDots: false
        });
      }
    };

    // Check if scripts are loaded
    const checkScripts = setInterval(() => {
      if (window.THREE && window.VANTA) {
        clearInterval(checkScripts);
        initVanta();
      }
    }, 100);

    return () => {
      document.body.removeChild(threeScript);
      document.body.removeChild(vantaScript);
      clearInterval(checkScripts);
    };
  }, []);

  const validateLogin = () => {
    const errors: any = {};
    if (!email.trim()) errors.email = 'Email address is required.';
    if (!password) errors.password = 'Password is required.';
    return errors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        setIsLoading(true);
        await login(email, password);
        toast.success('Successfully logged in!');
      } catch (error) {
        toast.error('Failed to login. Please try again.');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateRegister = () => {
    const errors: any = {};
    if (!regName.trim()) errors.regName = 'First name is required.';
    if (!regSurname.trim()) errors.regSurname = 'Last name is required.';
    if (!regEmail.trim()) errors.regEmail = 'Email address is required.';
    if (!regPassword) errors.regPassword = 'Password is required.';
    if (!regConfirm) errors.regConfirm = 'Please confirm your password.';
    if (regPassword && regConfirm && regPassword !== regConfirm) errors.regConfirm = 'Passwords do not match.';
    return errors;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegister();
    setRegErrors(errors);
    if (Object.keys(errors).length === 0) {
      // TODO: register logic
      router.push('/onboarding');
    }
  };

  return (
    <>
      <div id="vanta-bg"></div>
      <div className="fixed inset-0 bg-white/20 z-[-1]"></div>
      <div className="min-h-screen relative z-10">
        {/* Centered Login/Register Form */}
        <div className="relative flex flex-col items-center justify-center min-h-screen py-8 px-4 font-sans">
          <div className="flex flex-col items-center mb-4">
            <div className="rounded-full bg-primary/10 p-2 mb-4">
              <Logo width={60} height={60} targetUrl="/" />
            </div>
          </div>
          <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 space-y-6" style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <div className="mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">Welcome</h1>
              <p className="text-gray-500 dark:text-gray-300 text-base text-center max-w-md">Your secure contract execution platform</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>
            <div className="mb-2">
              <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">{tab === 'login' ? 'Sign in to Escra' : 'Create a new account'}</h2>
              <p className="text-center text-gray-500 dark:text-gray-300 text-sm mb-4">Sign in to your account or create a new one</p>
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-1.5 text-sm font-semibold transition-colors duration-150 ${tab === 'login' ? 'bg-white dark:bg-gray-800 text-primary shadow rounded-l-lg' : 'text-gray-500 dark:text-gray-300'}`}
                  onClick={() => setTab('login')}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-1.5 text-sm font-semibold transition-colors duration-150 border-l border-gray-200 dark:border-gray-700 ${tab === 'register' ? 'bg-white dark:bg-gray-800 text-primary shadow border-r border-gray-200 dark:border-gray-700 rounded-r-lg' : 'text-gray-500 dark:text-gray-300'}`}
                  onClick={() => setTab('register')}
                >
                  Create Account
                </button>
              </div>
            </div>
            {tab === 'login' ? (
              <form className="space-y-4" onSubmit={handleLogin} noValidate>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {loginErrors.email && <p className="text-xs text-red-600 mt-1">{loginErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pr-10 py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-xs text-red-600 mt-1">{loginErrors.password}</p>}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div />
                  <a href="#" className="text-gray-900 dark:text-white text-xs font-medium hover:underline">Forgot password or email?</a>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-1.5 rounded-lg bg-primary text-white font-semibold text-sm shadow hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleRegister} noValidate>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {regErrors.regName && <p className="text-xs text-red-600 mt-1">{regErrors.regName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    value={regSurname}
                    onChange={e => setRegSurname(e.target.value)}
                    className="py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {regErrors.regSurname && <p className="text-xs text-red-600 mt-1">{regErrors.regSurname}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {regErrors.regEmail && <p className="text-xs text-red-600 mt-1">{regErrors.regEmail}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="pr-10 py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                      onClick={() => setShowRegPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showRegPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regErrors.regPassword && <p className="text-xs text-red-600 mt-1">{regErrors.regPassword}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showRegConfirm ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={regConfirm}
                      onChange={e => setRegConfirm(e.target.value)}
                      className="pr-10 py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                      onClick={() => setShowRegConfirm(v => !v)}
                      tabIndex={-1}
                    >
                      {showRegConfirm ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {regErrors.regConfirm && <p className="text-xs text-red-600 mt-1">{regErrors.regConfirm}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-primary text-white font-semibold text-sm shadow hover:bg-primary/90 transition-colors"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
          <p className="mt-8 text-center text-xs text-gray-400 max-w-md">
            By continuing, you agree to Escra's <a href="#" className="underline hover:text-primary">Terms of Service</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>
          </p>
        </div>
      </div>
    </>
  );
} 