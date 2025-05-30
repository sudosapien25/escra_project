'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HiMiniChevronRight } from 'react-icons/hi2';
import { FaCheck } from 'react-icons/fa';

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Professional');

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
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 5 contracts',
        'Basic workflow automation',
        'Email support',
        'Standard templates',
        'Basic analytics'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Up to 20 contracts',
        'Advanced workflow automation',
        'Priority support',
        'Custom templates',
        'Advanced analytics',
        'API access'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited contracts',
        'Custom workflow automation',
        '24/7 dedicated support',
        'Custom development',
        'Advanced security',
        'SLA guarantees',
        'Custom integrations'
      ],
      buttonStyle: 'bg-black text-white hover:bg-primary hover:italic transition-all'
    }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required.'
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
      
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium tracking-tight">
            <Link href="/">
              <Image
                src="/primary escra (color) copy.png"
                alt="ESCRA Logo"
                width={160}
                height={53}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">Solutions</a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">Resources</a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">Features</a>
          </div>
          
          <div className="flex items-center space-x-1">
            <a href="#" className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-primary hover:italic transition-all">
              Sign up
            </a>
            <Link href="/login" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-primary hover:text-white hover:italic transition-all font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-40">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-4xl">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-[1.2] mb-2 text-center font-['Avenir']">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-12 text-center font-['Avenir']">
              Choose the plan that's right for you
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
            {plans.map((plan) => (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`relative rounded-2xl border cursor-pointer transition-all group ${
                  selectedPlan === plan.name
                    ? 'border-black bg-white/50'
                    : plan.popular
                    ? 'border-primary bg-white/50'
                    : 'border-gray-200 bg-white/30'
                } p-8 font-['Avenir'] hover:border-black hover:-translate-y-1`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className={`text-xl font-semibold transition-colors ${selectedPlan === plan.name ? 'text-primary' : 'text-black group-hover:text-primary'}`}>{plan.name}</h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-black">
                      ${plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <a
                    href="#"
                    className={`mt-6 block w-full rounded-lg px-4 py-2 text-center text-sm font-medium ${plan.buttonStyle}`}
                  >
                    Get started
                  </a>
                </div>
                <div className="mt-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <FaCheck className="h-5 w-5 text-primary mt-0.5" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-4xl w-full">
            <h2 className="text-3xl font-medium text-black text-center mb-12 font-['Avenir']">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-white/30 rounded-lg p-6 border border-gray-200 font-['Avenir']">
                  <h3 className="text-lg font-medium text-black mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20">
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-3xl md:text-4xl font-light mb-1">99%</div>
              <div className="text-gray-500 text-sm">Customer Satisfaction</div>
            </div>
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-3xl md:text-4xl font-light mb-1">24/7</div>
              <div className="text-gray-500 text-sm">Support Available</div>
            </div>
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-3xl md:text-4xl font-light mb-1">10k+</div>
              <div className="text-gray-500 text-sm">Active Users</div>
            </div>
            <div className="flex flex-col items-center font-['Avenir']">
              <div className="text-3xl md:text-4xl font-light mb-1">100%</div>
              <div className="text-gray-500 text-sm">Cloud-based</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 