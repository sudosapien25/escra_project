'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/common/Input';
import { Select, SelectOption } from '@/components/common/Select';
import { Logo } from '@/components/common/Logo';
import { HiMiniChevronDown } from 'react-icons/hi2';
import { FaCheck } from 'react-icons/fa';
import { TbBuildingEstate, TbShoppingBagEdit, TbWorld } from 'react-icons/tb';
import { MdOutlineSportsFootball, MdOutlineMovieFilter, MdOutlineHealthAndSafety } from 'react-icons/md';
import { LuConstruction, LuBriefcaseBusiness } from 'react-icons/lu';
import { GrMoney, GrUserWorker } from 'react-icons/gr';
import { VscLaw } from 'react-icons/vsc';
import { LiaToolsSolid } from 'react-icons/lia';
import { HiOutlineChip } from 'react-icons/hi';
import { IconType } from 'react-icons';

interface IndustryOption extends SelectOption {
  icon: IconType;
}

const COMPANY_TYPES: SelectOption[] = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'llc', label: 'Limited Liability Company (LLC)' },
  { value: 'other', label: 'Other' }
];

const INDUSTRIES: IndustryOption[] = [
  { value: 'real_estate', label: 'Real Estate', icon: TbBuildingEstate },
  { value: 'athletics', label: 'Athletics', icon: MdOutlineSportsFootball },
  { value: 'construction', label: 'Construction', icon: LuConstruction },
  { value: 'entertainment', label: 'Entertainment', icon: MdOutlineMovieFilter },
  { value: 'finance', label: 'Finance', icon: GrMoney },
  { value: 'healthcare', label: 'Healthcare', icon: MdOutlineHealthAndSafety },
  { value: 'labor', label: 'Labor', icon: GrUserWorker },
  { value: 'legal', label: 'Legal', icon: VscLaw },
  { value: 'manufacturing', label: 'Manufacturing', icon: LiaToolsSolid },
  { value: 'retail', label: 'Retail', icon: TbShoppingBagEdit },
  { value: 'supply_chain', label: 'Logistics', icon: TbWorld },
  { value: 'technology', label: 'Technology', icon: HiOutlineChip },
  { value: 'other', label: 'Other', icon: LuBriefcaseBusiness }
];

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
  { value: 'VU', label: 'Uzbekistan' },
  { value: 'VA', label: 'Vatican City' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' }
];

const US_STATES: SelectOption[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState<'personal' | 'business'>('business');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    industry: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    phoneNumber: '',
    website: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCompanyTypeDropdown, setShowCompanyTypeDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const companyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const industryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      if (showStateDropdown && stateDropdownRef.current && !stateDropdownRef.current.contains(target)) {
        setShowStateDropdown(false);
      }
      
      if (showCountryDropdown && countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
        setShowCountryDropdown(false);
      }
      
      if (showCompanyTypeDropdown && companyTypeDropdownRef.current && !companyTypeDropdownRef.current.contains(target)) {
        setShowCompanyTypeDropdown(false);
      }
      
      if (showIndustryDropdown && industryDropdownRef.current && !industryDropdownRef.current.contains(target)) {
        setShowIndustryDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStateDropdown, showCountryDropdown, showCompanyTypeDropdown, showIndustryDropdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleIndustryToggle = (industryValue: string) => {
    setSelectedIndustries(prev => {
      if (prev.includes(industryValue)) {
        return prev.filter(i => i !== industryValue);
      }
      return [...prev, industryValue];
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (tab === 'business') {
      // Business tab required fields
      const requiredFields = [
        'companyName',
        'companyType',
        'address',
        'city',
        'state',
        'zipCode',
        'country',
        'phoneNumber'
      ];

      requiredFields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
          errors[field] = 'Please fill out this field';
          isValid = false;
        }
      });

      // Phone validation
      if (formData.phoneNumber && !/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
        isValid = false;
      }

      // Website validation (optional)
      if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
        errors.website = 'Please enter a valid website URL';
        isValid = false;
      }

      // Industry selection validation for step 2
      if (step === 2 && selectedIndustries.length === 0) {
        errors.industrySelection = 'Please select at least one industry';
        isValid = false;
      }
    } else {
      // Personal tab required fields
      const requiredFields = [
        'address',
        'city',
        'state',
        'zipCode',
        'country',
        'phoneNumber'
      ];

      requiredFields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
          errors[field] = 'Please fill out this field';
          isValid = false;
        }
      });

      // Phone validation
      if (formData.phoneNumber && !/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    
    if (isValid) {
      // TODO: Submit form data with selectedIndustries
      router.push('/dashboard');
    }
  };

  const handleNext = () => {
    const isValid = validateForm();
    if (isValid) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-800 py-4 px-4 font-sans">
      <div className="flex flex-col items-center mb-4">
        <div className="rounded-full bg-primary/10 p-2 mb-4">
          <Logo width={60} height={60} />
        </div>
      </div>

      <div className={`w-full ${tab === 'business' ? 'max-w-3xl' : 'max-w-md'} bg-white dark:bg-gray-800 rounded-2xl p-4 transition-all duration-300`} style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
        <div className="mb-2">
          <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-1">Complete your profile</h2>
          <p className="text-center text-gray-500 dark:text-gray-300 text-sm mb-3">Tell us more about your business</p>
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden mb-3 border border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-1.5 text-sm font-semibold transition-colors duration-150 ${tab === 'personal' ? 'bg-white dark:bg-gray-800 text-primary shadow' : 'text-gray-500 dark:text-gray-300'}`}
              onClick={() => setTab('personal')}
            >
              Personal
            </button>
            <button
              className={`flex-1 py-1.5 text-sm font-semibold transition-colors duration-150 ${tab === 'business' ? 'bg-white dark:bg-gray-800 text-primary shadow' : 'text-gray-500 dark:text-gray-300'}`}
              onClick={() => setTab('business')}
            >
              Business
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-1 bg-primary rounded-full" style={{ width: `${(step / 2) * 100}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Step {step} of 2</p>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-3 ${tab === 'business' ? 'max-w-3xl' : ''}`} noValidate>
          {tab === 'business' && step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.companyName ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                  required
                />
                {formErrors.companyName && <p className="text-xs text-red-600 mt-1">{formErrors.companyName}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company Type</label>
                  <div className="relative w-full" ref={companyTypeDropdownRef}>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border-2 ${formErrors.companyType ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary'} rounded-lg text-xs font-medium text-black transition-colors pr-10 cursor-pointer bg-white`}
                      placeholder="Select company type"
                      value={COMPANY_TYPES.find(t => t.value === formData.companyType)?.label || ''}
                      readOnly
                      onClick={() => setShowCompanyTypeDropdown(true)}
                    />
                    <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showCompanyTypeDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {COMPANY_TYPES.map(type => (
                          <button
                            key={type.value}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${formData.companyType === type.value ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                            onClick={e => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, companyType: type.value }));
                              setShowCompanyTypeDropdown(false);
                            }}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.companyType && <p className="text-xs text-red-600 mt-1">{formErrors.companyType}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Address</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your business address"
                  className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.address ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                  required
                />
                {formErrors.address && <p className="text-xs text-red-600 mt-1">{formErrors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.city ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                    required
                  />
                  {formErrors.city && <p className="text-xs text-red-600 mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <div className="relative w-full" ref={stateDropdownRef}>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border-2 ${formErrors.state ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary'} rounded-lg text-xs font-medium text-black transition-colors pr-10 cursor-pointer bg-white`}
                      placeholder="Select state"
                      value={US_STATES.find(s => s.value === formData.state)?.label || ''}
                      readOnly
                      onClick={() => setShowStateDropdown(true)}
                    />
                    <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showStateDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {US_STATES.map(state => (
                          <button
                            key={state.value}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${formData.state === state.value ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                            onClick={e => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, state: state.value }));
                              setShowStateDropdown(false);
                            }}
                          >
                            {state.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.state && <p className="text-xs text-red-600 mt-1">{formErrors.state}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code</label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter ZIP code"
                    className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.zipCode ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                    required
                  />
                  {formErrors.zipCode && <p className="text-xs text-red-600 mt-1">{formErrors.zipCode}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                  <div className="relative w-full" ref={countryDropdownRef}>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border-2 ${formErrors.country ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary'} rounded-lg text-xs font-medium text-black transition-colors pr-10 bg-white`}
                      placeholder="Select country"
                      value={COUNTRIES.find(c => c.value === formData.country)?.label || ''}
                      readOnly
                      onClick={() => setShowCountryDropdown(true)}
                    />
                    <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showCountryDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {COUNTRIES.map(country => (
                          <button
                            key={country.value}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${formData.country === country.value ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                            onClick={e => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, country: country.value }));
                              setShowCountryDropdown(false);
                            }}
                          >
                            {country.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.country && <p className="text-xs text-red-600 mt-1">{formErrors.country}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone #"
                    className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.phoneNumber ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                    required
                  />
                  {formErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{formErrors.phoneNumber}</p>}
                </div>
                <div></div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Website (Optional)</label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter your website"
                  className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.website ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                />
                {formErrors.website && <p className="text-xs text-red-600 mt-1">{formErrors.website}</p>}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-1.5 rounded-lg bg-primary text-white font-semibold text-sm shadow hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            </>
          ) : tab === 'business' && step === 2 ? (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Personalize your experience...</h3>
                <p className="text-xs text-gray-500 mb-4">Choose additional industries to see more contract templates</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INDUSTRIES.map(industry => (
                    <button
                      key={industry.value}
                      type="button"
                      onClick={() => handleIndustryToggle(industry.value)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        selectedIndustries.includes(industry.value)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 border border-gray-300 rounded mr-3 flex-shrink-0 flex items-center justify-center">
                          {selectedIndustries.includes(industry.value) && (
                            <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                              <FaCheck className="text-white" size={8} />
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-gray-900">{industry.label}</span>
                      </div>
                      <div className="ml-3 text-gray-500">
                        {industry.icon && <industry.icon size={20} />}
                      </div>
                    </button>
                  ))}
                </div>
                {formErrors.industrySelection && (
                  <p className="text-xs text-red-600 mt-2">{formErrors.industrySelection}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">*You can change this later.</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 rounded-lg bg-primary text-white font-semibold text-sm shadow hover:bg-primary/90 transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.address ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                  required
                />
                {formErrors.address && <p className="text-xs text-red-600 mt-1">{formErrors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.city ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                    required
                  />
                  {formErrors.city && <p className="text-xs text-red-600 mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                  <div className="relative w-full" ref={stateDropdownRef}>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border-2 ${formErrors.state ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary'} rounded-lg text-xs font-medium text-black transition-colors pr-10 cursor-pointer bg-white`}
                      placeholder="Select state"
                      value={US_STATES.find(s => s.value === formData.state)?.label || ''}
                      readOnly
                      onClick={() => setShowStateDropdown(true)}
                    />
                    <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showStateDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {US_STATES.map(state => (
                          <button
                            key={state.value}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${formData.state === state.value ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                            onClick={e => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, state: state.value }));
                              setShowStateDropdown(false);
                            }}
                          >
                            {state.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.state && <p className="text-xs text-red-600 mt-1">{formErrors.state}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code</label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter ZIP code"
                    className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.zipCode ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                    required
                  />
                  {formErrors.zipCode && <p className="text-xs text-red-600 mt-1">{formErrors.zipCode}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                  <div className="relative w-full" ref={countryDropdownRef}>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border-2 ${formErrors.country ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary'} rounded-lg text-xs font-medium text-black transition-colors pr-10 bg-white`}
                      placeholder="Select country"
                      value={COUNTRIES.find(c => c.value === formData.country)?.label || ''}
                      readOnly
                      onClick={() => setShowCountryDropdown(true)}
                    />
                    <HiMiniChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showCountryDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {COUNTRIES.map(country => (
                          <button
                            key={country.value}
                            className={`w-full text-left px-3 py-0.5 text-xs font-medium ${formData.country === country.value ? 'bg-primary/10 text-primary' : 'text-gray-900 hover:bg-primary/10 hover:text-primary'}`}
                            onClick={e => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, country: country.value }));
                              setShowCountryDropdown(false);
                            }}
                          >
                            {country.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.country && <p className="text-xs text-red-600 mt-1">{formErrors.country}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone #"
                    className={`py-0.5 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 ${formErrors.phoneNumber ? 'border-red-300 focus:border-red-300 focus:ring-red-300' : ''}`}
                    required
                  />
                  {formErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{formErrors.phoneNumber}</p>}
                </div>
                <div></div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-primary text-white font-semibold text-sm shadow hover:bg-primary/90 transition-colors"
              >
                Complete Setup
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
} 