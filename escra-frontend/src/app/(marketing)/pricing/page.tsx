'use client';

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { HiMiniChevronDown, HiMiniChevronUp } from 'react-icons/hi2';
import { TbCreditCard } from 'react-icons/tb';
import { PiBankBold } from 'react-icons/pi';
import { TbBrandPaypal, TbCurrencyBitcoin, TbCurrencyEthereum, TbCurrencySolana } from 'react-icons/tb';
import { SiAlgorand, SiLitecoin } from 'react-icons/si';
import GlobalNavigation from '@/components/layout/GlobalNavigation';
import '@/app/globals.css';

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [hoveredPaymentIcon, setHoveredPaymentIcon] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  const plans = [
    {
      name: 'Essential',
      description: 'Tamper-proof essential signing tools',
      monthlyPrice: 12,
      yearlyPrice: 9,
      features: [
        '5 contracts per month',
        '20 signers per month',
        '20 GB document storage',
        'Unlimited Recipients',
        '2FA Authentication',
        'KYC verification',
        'Blockchain secured completion'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all'
    },
    {
      name: 'Pro',
      description: 'Enhanced contract capacity, advanced security & granular auditability',
      monthlyPrice: 115,
      yearlyPrice: 99,
      features: [
        '50 contracts per month',
        '200 signers per month',
        '5 custom templates',
        '100 GB document storage',
        'Complete audit trail',
        'KYC/KYB verification',
        'Advanced Analytics',
        'Select third-party integrations'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all',
      popular: true
    },
    {
      name: 'Growth',
      description: 'A shared workspace for your team',
      monthlyPrice: 350,
      yearlyPrice: 299,
      features: [
        '250 contracts per month',
        '1000 signers per month',
        'Up to 10 custom templates',
        '750 GB document storage',
        'Includes 3 members',
        'Add more users at $9 per month',
        'Custom branding',
        'Robust third-party integrations'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all'
    },
    {
      name: 'Enterprise',
      description: 'Signing solutions tailored for organizations at scale',
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        'Unlimited contracts',
        'Scaled signing capacity',
        '1 TB+ document storage',
        'Multi-team support',
        'Flexible user licensing',
        'Whitelabeling',
        'Dedicated account manager',
        'Integration Support'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all'
    }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, cryptocurrencies, PayPal & bank transfers for annual plans.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 30-day free trial on the Essential plan. No credit card required.'
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'You\'ll be notified when you\'re approaching your limits. You can upgrade your plan at any time to accommodate your needs.'
    }
  ];

  return (
    <>
      <div id="vanta-bg"></div>
      <div className="fixed inset-0 bg-white/20 z-[-1]"></div>
      
      <GlobalNavigation />

      <div className="container mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-40">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-4xl">
            <h1 className="text-xl md:text-2xl font-medium tracking-tight leading-[1.2] mb-2 text-center font-['Avenir']">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-600 text-base max-w-2xl mx-auto mb-2 text-center font-['Avenir']">
              Choose the plan that's right for you
            </p>
          </div>

          {/* Monthly/Yearly Billing Toggle */}
          <div className="flex justify-center mt-8 mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1 border-2 border-gray-200">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  billingPeriod === 'monthly' 
                    ? 'bg-gray-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  billingPeriod === 'yearly' 
                    ? 'bg-gray-500 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-[85rem]">
            {plans.map((plan) => (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative rounded-2xl border border-gray-200 cursor-pointer transition-all group flex flex-col min-h-[680px] ${
                  selectedPlan === plan.name
                    ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] bg-white'
                    : plan.popular
                    ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] bg-white'
                    : 'shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] bg-white'
                } p-8 font-['Avenir'] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-1`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                {/* Header Section - Fixed Height */}
                <div className="text-center h-32">
                  <h3 className={`text-base font-semibold transition-colors ${selectedPlan === plan.name ? 'text-primary' : 'text-black group-hover:text-primary'}`}>{plan.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                </div>
                
                {/* Pricing Section - Fixed Height */}
                <div className="text-center h-20">
                  <div className="-mt-2">
                    {plan.monthlyPrice !== null ? (
                      <>
                        <span className="text-2xl font-bold text-black">
                          ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-xs text-gray-600">
                          /month
                        </span>
                        {billingPeriod === 'yearly' && (
                          <div className="text-xs text-gray-600 mt-1">
                            *Billed annually
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xl font-bold text-black">Custom</span>
                    )}
                  </div>
                </div>
                
                {/* Features Section - Flexible */}
                <div className="flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <FaCheck className="h-5 w-5 text-primary mt-0.5" />
                        <span className="ml-3 text-xs text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Button Section - Fixed Height */}
                <div className={`${plan.name === 'Essential' ? 'h-16' : 'h-12'} flex items-end flex-col ${plan.name === 'Essential' ? 'space-y-1' : 'space-y-2'}`}>
                  {plan.name === 'Essential' && (
                    <a
                      href="#"
                      className="block w-full rounded-lg px-4 py-2 text-center text-xs font-medium bg-gray-500 text-white hover:bg-primary hover:text-white hover:italic transition-colors"
                    >
                      30-day free trial
                    </a>
                  )}
                  {plan.name !== 'Essential' && (
                    <p className="text-xs text-gray-500 text-center mb-2 w-full -mt-3">
                      {plan.name === 'Pro' && "(Everything in the Essential tier + much more)"}
                      {plan.name === 'Growth' && "(Everything in the Pro tier + much more)"}
                      {plan.name === 'Enterprise' && "(Everything in the Growth tier + much more)"}
                    </p>
                  )}
                  <a
                    href="#"
                    className={`block w-full rounded-lg px-4 py-2 text-center text-xs font-medium ${plan.buttonStyle} -mt-5`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact us' : 'Get started'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl w-full">
            <h2 className="text-lg font-medium text-black text-center mb-12 font-['Avenir']">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="bg-white rounded-lg border border-gray-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] font-['Avenir'] overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <h3 className="text-sm font-medium text-black pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <HiMiniChevronUp className="text-gray-500 flex-shrink-0" size={16} />
                    ) : (
                      <HiMiniChevronDown className="text-gray-500 flex-shrink-0" size={16} />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <>
                      <hr className="border-gray-200 dark:border-gray-700 mx-6" />
                      <div className="px-6 pb-8 pt-6">
                        <p className="text-xs text-gray-600">{faq.answer}</p>
                        {index === 0 && (
                          <div className="flex space-x-1 mt-4">
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('credit-card')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <TbCreditCard className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'credit-card' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10 whitespace-nowrap">
                                  Credit card
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('wires')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <PiBankBold className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'wires' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  Wire
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('paypal')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <TbBrandPaypal className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'paypal' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  PayPal
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('bitcoin')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <TbCurrencyBitcoin className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'bitcoin' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  Bitcoin
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('ethereum')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <TbCurrencyEthereum className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'ethereum' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  Ethereum
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('algorand')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <SiAlgorand className="w-[12px] h-[12px] text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'algorand' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  Algorand
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('solana')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <TbCurrencySolana className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'solana' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  Solana
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <div 
                                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onMouseEnter={() => setHoveredPaymentIcon('litecoin')}
                                onMouseLeave={() => setHoveredPaymentIcon(null)}
                              >
                                <SiLitecoin className="w-4 h-4 text-gray-600" />
                              </div>
                              {hoveredPaymentIcon === 'litecoin' && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                                  Litecoin
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20">
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-xl md:text-2xl font-light mb-1">99%</div>
              <div className="text-gray-500 text-xs">Customer Satisfaction</div>
            </div>
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-xl md:text-2xl font-light mb-1">24/7</div>
              <div className="text-gray-500 text-xs">Support Available</div>
            </div>
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-xl md:text-2xl font-light mb-1">10k+</div>
              <div className="text-gray-500 text-xs">Active Users</div>
            </div>
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-xl md:text-2xl font-light mb-1">100%</div>
              <div className="text-gray-500 text-xs">Cloud-based</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 