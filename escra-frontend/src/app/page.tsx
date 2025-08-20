'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DecryptedText from '@/components/DecryptedText';
import { HiMiniChevronRight } from 'react-icons/hi2';
import { HiOutlineIdentification, HiOutlineKey, HiOutlineCube, HiOutlineCog, HiOutlineDocumentText, HiOutlineClipboardCheck, HiOutlineServer, HiOutlineFingerPrint, HiOutlineLockClosed, HiOutlineChip, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineDuplicate } from 'react-icons/hi';
import { TbBuildingEstate, TbWorld, TbSettingsAutomation, TbServerSpark, TbAdjustmentsAlt, TbAtom, TbBolt, TbAbacus, TbWindow, TbEyeSearch, TbShieldSearch, TbShield, TbLock, TbShieldCheck, TbServer, TbNetwork, TbShieldStar, TbEngine, TbScale, TbWall, TbShieldLock, TbClipboardSearch, TbBuildingCommunity, TbBallAmericanFootball, TbManualGearbox, TbTool, TbGitBranch, TbCoins } from 'react-icons/tb';
import { LuBriefcaseBusiness, LuConstruction, LuTrello, LuBlocks, LuIdCard, LuCpu, LuAtom, LuLayers3 } from 'react-icons/lu';
import { GrMoney, GrUserWorker } from 'react-icons/gr';
import { VscLaw } from 'react-icons/vsc';
import { MdOutlineSportsFootball, MdOutlineMovieFilter, MdOutlineHealthAndSafety } from 'react-icons/md';
import { LiaToolsSolid, LiaSalesforce, LiaJira } from 'react-icons/lia';
import { HiOutlineChip as HiOutlineChipAlt } from 'react-icons/hi';
import { FaDochub } from 'react-icons/fa';
import { SiAdobe } from 'react-icons/si';
import { SlSocialDropbox } from 'react-icons/sl';
import { PiGoogleDriveLogoBold, PiMicrosoftTeamsLogoBold, PiListMagnifyingGlassBold, PiLockKeyBold, PiNetworkBold } from 'react-icons/pi';
import { FaSlack, FaTimeline } from 'react-icons/fa6';
import { RxNotionLogo } from 'react-icons/rx';
import { TbBrandOnedrive, TbBrandAirtable, TbBrandAsana } from 'react-icons/tb';
import VantaBackground from '@/components/VantaBackground';
import GlobalNavigation from '@/components/layout/GlobalNavigation';
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';

// Vanta.js configuration (preserved for future use):
// {
//   el: "#vanta-bg",
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   scale: 1.00,
//   scaleMobile: 1.00,
//   color: 0x00b4d8,
//   backgroundColor: 0xffffff,
//   points: 9.00,
//   maxDistance: 25.00,
//   spacing: 18.00,
//   showDots: false
// }

export default function LandingPage() {
  const [currentIndustryIndex, setCurrentIndustryIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('alpha');
  const [showContactEmail, setShowContactEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hoveredEmail, setHoveredEmail] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('info@escra.io');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1500);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  };

  // Continuous scrolling effect
  useEffect(() => {
    if (!isScrolling) return;

    const interval = setInterval(() => {
      setScrollPosition(prev => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const maxScroll = container.scrollWidth - container.clientWidth;
          const newPosition = prev + 1;
          
          if (newPosition >= maxScroll) {
            // Reset to beginning for seamless loop
            return 0;
          }
          return newPosition;
        }
        return prev;
      });
    }, 30); // Adjust speed here (lower = faster)

    return () => clearInterval(interval);
  }, [isScrolling]);

  // Apply scroll position
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  const industries = [
    {
      name: 'Real Estate',
      icon: TbBuildingCommunity,
      description: 'Property sale & lease agreements with blockchain-backed ownership verification and automated escrow processes'
    },
    {
      name: 'Corporate',
      icon: LuBriefcaseBusiness,
      description: 'Enterprise, employment & vendor agreements with automated compliance tracking and multi-stakeholder approval workflows'
    },
    {
      name: 'Finance',
      icon: TbCoins,
      description: 'Advisory, Lending, M&A agreements with instant settlement capabilities and regulatory compliance automation'
    },
    {
      name: 'Legal',
      icon: TbScale,
      description: 'Wills, trusts, deeds & compliance agreements with immutable audit trails & assisted legal document generation'
    },
    {
      name: 'Logistics',
      icon: TbWorld,
      description: 'Transportation, supply-chain & warehousing agreements with real-time tracking and automated milestone verification'
    },
    {
      name: 'Labor',
      icon: GrUserWorker,
      description: 'Dispute resolution, collective-bargaining & union agreements with transparent voting systems and automated enforcement'
    },
    {
      name: 'Entertainment',
      icon: MdOutlineMovieFilter,
      description: 'Media, artist & performance agreements with royalty tracking and automated payment distribution systems'
    },
    {
      name: 'Athletics',
      icon: TbBallAmericanFootball,
      description: 'Front-offices, leagues, player contracts & endorsements with performance-based automation and endorsement tracking'
    },
    {
      name: 'Construction',
      icon: LuConstruction,
      description: 'Building, project & subcontractor agreements with milestone-based payments and automated quality assurance checks'
    },
    {
      name: 'Healthcare',
      icon: MdOutlineHealthAndSafety,
      description: 'Medical provider & health service agreements with HIPAA-compliant data handling and automated billing verification'
    },
    {
      name: 'Manufacturing',
      icon: TbTool,
      description: 'Production, supply & equipment agreements with quality control automation and supply chain transparency'
    },
    {
      name: 'Technology',
      icon: HiOutlineChipAlt,
      description: 'IT service, vendor & software licensing agreements with automated license management and usage tracking'
    }
  ];

  const nextIndustry = () => {
    setCurrentIndustryIndex((prev) => (prev + 4) % industries.length);
  };

  const prevIndustry = () => {
    setCurrentIndustryIndex((prev) => (prev - 4 + industries.length) % industries.length);
  };

  // Timeline phases organized by year and quarter with actual date ranges
  const timelineYears = [
    {
      year: '2025',
      quarters: [
        { id: 'q1-2025', period: 'Q1', phase: 'alpha', active: true },
        { id: 'q2-2025', period: 'Q2', phase: 'alpha', active: true },
        { id: 'q3-2025', period: 'Q3', phase: 'alpha', active: true },
        { id: 'q4-2025', period: 'Q4', phase: 'beta', active: true }
      ]
    },
    {
      year: '2026',
      quarters: [
        { id: 'q1-2026', period: 'Q1', phase: 'beta', active: true },
        { id: 'q2-2026', period: 'Q2', phase: 'production', active: true },
        { id: 'q3-2026', period: 'Q3', phase: 'fast-follows', active: true },
        { id: 'q4-2026', period: 'Q4', phase: 'fast-follows', active: true }
      ]
    },
    {
      year: '2027',
      quarters: [
        { id: 'q1-2027', period: 'Q1', phase: 'fast-follows', active: true },
        { id: 'q2-2027', period: 'Q2', phase: 'mobilize', active: true },
        { id: 'q3-2027', period: 'Q3', phase: 'collaborate', active: true },
        { id: 'q4-2027', period: 'Q4', phase: 'expand', active: true }
      ]
    },
    {
      year: '2028',
      quarters: [
        { id: 'q1-2028', period: 'Q1', phase: 'expand', active: true },
        { id: 'q2-2028', period: 'Q2', phase: 'expand', active: true },
        { id: 'q3-2028', period: 'Q3', phase: 'expand', active: true },
        { id: 'q4-2028', period: 'Q4', phase: 'expand', active: true }
      ]
    },
    {
      year: '2029',
      quarters: [
        { id: 'q1-2029', period: 'Q1', phase: 'expand', active: true },
        { id: 'q2-2029', period: 'Q2', phase: 'expand', active: true },
        { id: 'q3-2029', period: 'Q3', phase: 'expand', active: true },
        { id: 'q4-2029', period: 'Q4', phase: 'expand', active: true }
      ]
    },
    {
      year: '2030',
      quarters: []
    }
  ];

  const handlePhaseChange = (phaseId: string) => {
    setCurrentPhase(phaseId);
  };

  // Function to determine if a quarter should be highlighted for the current phase
  const isQuarterHighlightedForPhase = (quarterId: string, currentPhase: string) => {
    switch (currentPhase) {
      case 'alpha':
        return ['q1-2025', 'q2-2025', 'q3-2025', 'q4-2025'].includes(quarterId);
      case 'beta':
        return ['q4-2025', 'q1-2026'].includes(quarterId);
      case 'production':
        return ['q1-2026', 'q2-2026'].includes(quarterId);
      case 'fast-follows':
        return ['q3-2026', 'q4-2026', 'q1-2027'].includes(quarterId);
      case 'mobilize':
        return ['q2-2027', 'q3-2027'].includes(quarterId);
      case 'collaborate':
        return ['q3-2027', 'q4-2027', 'q1-2028'].includes(quarterId);
      case 'expand':
        return ['q1-2028', 'q2-2028', 'q3-2028', 'q4-2028', 'q1-2029', 'q2-2029', 'q3-2029', 'q4-2029'].includes(quarterId);
      default:
        return false;
    }
  };

  // Handle scroll events to update current phase and roadmap stacking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which phase should be active based on roadmap card positions
      const roadmapCards = document.querySelectorAll('.roadmap-card');
      let activePhase = 'alpha'; // Default to alpha
      
      // Find the current phase's card and check if it has scrolled past the middle
      roadmapCards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const cardTop = cardRect.top;
        const cardHeight = cardRect.height;
        const cardBottom = cardTop + cardHeight;
        const phase = cardElement.getAttribute('data-phase');
        
        // Only switch to this phase if its card has scrolled past the middle of the screen
        if (phase && cardTop < windowHeight * 0.3) {
          activePhase = phase;
        }
      });
      
      setCurrentPhase(activePhase);

      // Handle roadmap card stacking
      const roadmapContainer = document.querySelector('.roadmap-container');
      
      if (roadmapContainer) {
        const containerRect = roadmapContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        
                  roadmapCards.forEach((card, index) => {
            const cardElement = card as HTMLElement;
            const cardRect = cardElement.getBoundingClientRect();
            const cardTop = cardRect.top;
            const cardHeight = cardRect.height;
            
            // Calculate when this card should start stacking
            const stackTriggerPoint = windowHeight * 0.8; // Start stacking at 80% of viewport
            
            if (cardTop < stackTriggerPoint) {
              // Calculate stacking progress
              const stackProgress = Math.max(0, Math.min(1, (stackTriggerPoint - cardTop) / 300));
              
              // Find how many cards have been stacked so far
              let stackedCount = 0;
              for (let j = 0; j < index; j++) {
                const jCardElement = roadmapCards[j] as HTMLElement;
                const jCardRect = jCardElement.getBoundingClientRect();
                const jCardTop = jCardRect.top;
                if (jCardTop < stackTriggerPoint) {
                  stackedCount++;
                }
              }
              
              // Only scale up the card that's currently in the trigger zone
              const isInTriggerZone = cardTop > stackTriggerPoint - 300 && cardTop < stackTriggerPoint;
              const scale = isInTriggerZone ? 1 + (stackProgress * 0.05) : 1; // Scale up only if in trigger zone
              
              // Calculate the stacking position - each card stacks on top of the previous ones
              const stackOffset = stackedCount * 8; // Small offset to show cards underneath
              const translateY = -stackOffset * stackProgress;
              const zIndex = 1000 + index; // Higher index = higher z-index (on top)
              
              cardElement.style.transform = `translateY(${translateY}px) scale(${scale})`;
              cardElement.style.zIndex = zIndex.toString();
              cardElement.style.position = 'relative';
            } else {
              // Reset card position when not stacking
              cardElement.style.transform = 'translateY(0px) scale(1)';
              cardElement.style.zIndex = 'auto';
            }
          });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleIndustries = industries.slice(currentIndustryIndex, currentIndustryIndex + 4);

  return (
    <>
      <VantaBackground />
      <GlobalNavigation />

      <div className="container mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-40">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.2] mb-2 text-center">
              <div className="mb-2">
                <DecryptedText
                  text="Powered by blockchain"
                  speed={50}
                  maxIterations={20}
                  sequential={true}
                  revealDirection="center"
                  animateOn="view"
                  className="text-black text-xl md:text-2xl lg:text-3xl"
                  encryptedClassName="text-gray-400"
                  parentClassName="inline-block"
                  autoReencrypt={true}
                  reencryptInterval={30000}
                />
              </div>
              <span className="inline-flex items-center justify-center flex-wrap gap-2">
                <span className="text-primary">Secure</span><span>,</span> <span className="text-primary">streamlined</span> <span className="text-primary">contracts</span>
              </span>
            </h1>
            
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-12 text-center">
              Transparent, efficient & immutable agreements for all industries
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-1 mb-12">
            <a href="#" className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-primary hover:italic transition-all button-glow">
              Get started
            </a>
            <a href="#" className="px-4 py-2 text-sm border border-black rounded-lg hover:bg-primary hover:text-white hover:border-transparent hover:italic transition-all flex items-center font-medium">
              Learn more <HiMiniChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          

          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20">
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-light mb-1">95%</div>
              <div className="text-gray-500 text-sm">User satisfaction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-light mb-1">15k+</div>
              <div className="text-gray-500 text-sm">Active users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-light mb-1">24/7</div>
              <div className="text-gray-500 text-sm">Support available</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-light mb-1">100%</div>
              <div className="text-gray-500 text-sm">Cloud-based</div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="text-center mt-20 mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Unified Contract Lifecycle Management
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {/* Identity Verification */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LuIdCard className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced KYC verification ensures only authenticated parties can participate. Cryptographic keys are generated and maintained throughout the entire contract lifecycle.
              </p>
            </div>

            {/* Cryptographic Signature Verification */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <HiOutlineKey className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cryptographic Signature Verification</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every signature is cryptographically verified and linked to proven identities. No forgery, no disputes—only mathematically certain authenticity.
              </p>
            </div>

            {/* Blockchain Integration */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LuBlocks className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Integration</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Key markers written on-chain create an immutable audit trail. Every milestone, signature, and state change is permanently recorded and verifiable.
              </p>
            </div>

            {/* Smart Contract Automation */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbGitBranch className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Contract Automation</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Programmable agreements execute automatically when conditions are met. No manual intervention, no delays—just instant, verified execution.
              </p>
            </div>

            {/* Immutable Audit Trail */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbShieldSearch className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Immutable Audit Trail</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete transaction history preserved on blockchain. Regulatory compliance made simple with tamper-proof records that can be verified by any party.
              </p>
            </div>

            {/* End-to-End Lifecycle Management */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FaTimeline className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">End-to-End Lifecycle Management</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                From initial identity verification to final settlement—Escra manages every aspect of contract execution with cryptographic certainty and blockchain security.
              </p>
            </div>
          </div>

          {/* Problem & Solution Section */}
          <div className="mt-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* The Contract Execution Crisis */}
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-8">
                  The Contract Execution Crisis
                </h2>
                
                {/* Statistical Overview */}
                <div className="space-y-4 mb-8">
                  <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-1">47%</div>
                    <div className="text-sm text-gray-600">of real estate transactions face delays due to manual processes</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-1">$12B</div>
                    <div className="text-sm text-gray-600">lost annually to contract fraud and identity disputes</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-1">72hrs</div>
                    <div className="text-sm text-gray-600">average time for wire transfer verification and settlement</div>
                  </div>
                </div>

                {/* Legacy System Failures */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Legacy System Failures:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Paper-based verification prone to forgery</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Manual milestone tracking creates bottlenecks</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">No real-time audit capabilities</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Identity verification happens only once, not maintained</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">High intermediary costs and fees</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Single points of failure in centralized systems</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Escra Solution */}
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-primary mb-8">
                  The Escra Solution
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TbAbacus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cryptographic Certainty</h3>
                        <p className="text-sm text-gray-600">Mathematical proof of identity and signature authenticity eliminates disputes before they start</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TbBolt className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Execution</h3>
                        <p className="text-sm text-gray-600">Smart contracts trigger instantly when conditions are met—no waiting for manual verification</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TbManualGearbox className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Persistent Identity Chain</h3>
                        <p className="text-sm text-gray-600">Once verified, identities remain cryptographically linked throughout the entire contract lifecycle</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TbShieldSearch className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Immutable Transparency</h3>
                        <p className="text-sm text-gray-600">Every action, signature, and milestone permanently recorded on Algorand blockchain</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Behind Trust Section */}
          <div className="text-center mt-20 mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Trustless Technology
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Identity verification, authenticated digital signatures & non-fungible execution, every step is secured by blockchain technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[72rem] mx-auto">
            {/* Blockchain Foundation */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbServerSpark className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Foundation</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Built on Algorand's pure proof-of-stake consensus mechanism, ensuring:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Immediate finality - No confirmation delays or rollback risks</li>
                <li>• Carbon negative - Environmentally sustainable blockchain operations</li>
                <li>• Low transaction costs - Fraction of pennies per on-chain marker</li>
                <li>• High throughput - 6,000+ transactions per second capability</li>
              </ul>
            </div>

            {/* Cryptographic Identity Chain */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <HiOutlineFingerPrint className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cryptographic Identity Chain</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Persona integration creates unbreakable identity-to-signature links:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• KYC verification - Government-grade identity confirmation</li>
                <li>• Key generation - Unique cryptographic signatures per party</li>
                <li>• Lifecycle maintenance - Identity integrity from start to finish</li>
                <li>• Multi-factor validation - Biometric + cryptographic proof</li>
              </ul>
            </div>

            {/* Immutable Audit Architecture */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <PiLockKeyBold className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Immutable Audit Architecture</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Every critical event creates permanent, verifiable records:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Milestone markers - Contract progress tracked on-chain</li>
                <li>• Signature timestamps - Exact moment of execution recorded</li>
                <li>• State transitions - Every status change permanently logged</li>
                <li>• Compliance exports - Audit trails ready for regulatory review</li>
              </ul>
            </div>

                        {/* Smart Contract Automation Engine */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbEngine className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Contract Automation Engine</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Programmable logic eliminates manual intervention points:
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Condition verification - Automated milestone checking</li>
                <li>• Multi-signature logic - Complex approval workflows</li>
                <li>• Wire instruction prep - Automatic formatting and validation</li>
                <li>• Exception handling - Programmed responses to edge cases</li>
              </ul>
            </div>
        </div>

        {/* TICKER Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Integrations
            </h2>
          </div>
          
                                <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-hidden"
            onMouseEnter={() => setIsScrolling(false)}
            onMouseLeave={() => setIsScrolling(true)}
          >
            {/* DocuSign */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <FaDochub className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            {/* Adobe Sign */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <SiAdobe className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            {/* Dropbox */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <SlSocialDropbox className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Google Drive */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <PiGoogleDriveLogoBold className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            {/* OneDrive */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <TbBrandOnedrive className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Salesforce */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <LiaSalesforce className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            {/* Microsoft Teams */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <PiMicrosoftTeamsLogoBold className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Slack */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <FaSlack className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            {/* Jira */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <LiaJira className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Trello */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <LuTrello className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            {/* Notion */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <RxNotionLogo className="w-8 h-8 text-black" />
              </div>
            </div>
            
            {/* Airtable */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <TbBrandAirtable className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            {/* Asana */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <TbBrandAsana className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            {/* Duplicate icons for seamless loop */}
            {/* DocuSign */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <FaDochub className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            {/* Adobe Sign */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <SiAdobe className="w-8 h-8 text-red-400" />
              </div>
            </div>
            
            {/* Dropbox */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <SlSocialDropbox className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Google Drive */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <PiGoogleDriveLogoBold className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            {/* OneDrive */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <TbBrandOnedrive className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Salesforce */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <LiaSalesforce className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            {/* Microsoft Teams */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <PiMicrosoftTeamsLogoBold className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Slack */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <FaSlack className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            {/* Jira */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <LiaJira className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            {/* Trello */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <LuTrello className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            {/* Notion */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <RxNotionLogo className="w-8 h-8 text-black" />
              </div>
            </div>
            
            {/* Airtable */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <TbBrandAirtable className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            {/* Asana */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <TbBrandAsana className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Industries Served Section */}
          <div className="text-center mt-20 mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Industries Served
            </h2>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(industries.length / 4) }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === Math.floor(currentIndustryIndex / 4) ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="relative flex items-center">
              <button
                onClick={prevIndustry}
                className="absolute left-0 z-10 h-10 w-10 rounded-lg bg-gray-500 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform -translate-x-1/2"
                disabled={currentIndustryIndex === 0}
              >
                <HiOutlineChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {visibleIndustries.map((industry, index) => {
                const IconComponent = industry.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow h-64 flex flex-col">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{industry.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                      {industry.description}
                    </p>
                  </div>
                );
              })}
              </div>
              
              <button
                onClick={nextIndustry}
                className="absolute right-0 z-10 h-10 w-10 rounded-lg bg-gray-500 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform translate-x-1/2"
                disabled={currentIndustryIndex + 4 >= industries.length}
              >
                <HiOutlineChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Enterprise-Grade Security & Compliance Section */}
          <div className="text-center mt-20 mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Enterprise-Grade Security & Compliance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[72rem] mx-auto">
            {/* Multi-Layer Identity Protection */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LuLayers3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Layer Identity Protection</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Persona's government-grade KYC combined with biometric verification and cryptographic key generation creates an unbreakable identity chain.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  NIST Compliance
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  FIDO2 Compatible
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  Zero-Knowledge Proofs
                </span>
              </div>
            </div>

            {/* Quantum-Resistant Cryptography */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbShieldLock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantum-Resistant Cryptography</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Future-proof encryption algorithms ensure your contracts remain secure even against next-generation quantum computing threats.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  AES-256
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  EdDSA Signatures
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  Post-Quantum Ready
                </span>
              </div>
            </div>

            {/* Regulatory Compliance Engine */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbClipboardSearch className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulatory Compliance Engine</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Automated compliance checking for GDPR, SOX, HIPAA, and industry-specific regulations with built-in audit trail generation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  AML/OFAC Compliant
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  GDPR Ready
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  SOX Ready
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  SOC 2 Type II Ready
                </span>
              </div>
            </div>

            {/* Decentralized Architecture */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TbNetwork className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Decentralized Architecture</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                No single point of failure with distributed verification nodes and redundant blockchain infrastructure ensuring 99.99% uptime.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  Multi-Region
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  Auto-Failover
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
                  Load Balanced
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Roadmap Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Roadmap
              </h2>
            </div>
            
            {/* Timeline Container with ScrollStack */}
            <div className="relative w-full mx-auto px-32">
              {/* Timeline */}
              <div className="absolute right-16 top-0 w-1 bg-gray-200 rounded-full z-10" style={{ height: '2420px' }}>
                {/* Timeline line segments for each phase */}
                {/* Alpha phase line (Q1 2025 to Q4 2025 dot) */}
                <div 
                  className={`absolute left-0 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'alpha' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '40px', height: '300px' }}
                ></div>
                
                {/* Beta phase line (Q4 2025 dot to past Q1 2026 dot) */}
                <div 
                  className={`absolute left-0 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'beta' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '340px', height: '240px' }}
                ></div>
                
                {/* Production phase line (Q1 2026 dot to halfway through Q2 2026) */}
                <div 
                  className={`absolute left-0 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'production' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '524px', height: '150px' }}
                ></div>
                
                {/* Fast Follows phase line (halfway through Q2 2026 to extend past Q1 2027) */}
                <div 
                  className={`absolute left-0 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'fast-follows' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '674px', height: '400px' }}
                ></div>
                
                {/* Mobilize phase line (halfway between Q1-Q2 2027 to Q3 2027) */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'mobilize' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '1058px', height: '170px' }}
                ></div>
                
                {/* Collaborate phase line (Q3 2027 to Q1 2028) */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'collaborate' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '1208px', height: '284px' }}
                ></div>
                
                {/* Expand phase line (Q1 2028 to 2030) */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 w-1 rounded-full transition-all duration-300 ${
                    currentPhase === 'expand' ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  style={{ top: '1492px', height: '928px' }}
                ></div>
                
                {timelineYears.map((yearData, yearIndex) => (
                  <div key={yearData.year}>
                    {/* Year Label */}
                    <div 
                      className="absolute -left-12 transform -translate-y-1/2 text-sm font-bold text-gray-700"
                      style={{ top: `${yearIndex * 484}px` }}
                    >
                      {yearData.year}
                    </div>
                    

                    
                    {/* Quarters within the year */}
                    {yearData.quarters.map((quarter, quarterIndex) => {
                      const totalIndex = yearIndex * 484 + quarterIndex * 100 + 40; // 40px offset for year label, 100px between quarters
                      const isHighlighted = isQuarterHighlightedForPhase(quarter.id, currentPhase);
                      return (
                        <div key={quarter.id}>
                          <div 
                            className={`absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full transition-all duration-300 ${
                              isHighlighted
                                ? 'bg-primary scale-125' 
                                : quarter.active 
                                  ? 'bg-gray-400' 
                                  : 'bg-gray-300'
                            }`}
                            style={{ top: `${totalIndex}px` }}
                          ></div>
                          <div 
                            className={`absolute left-8 transform -translate-y-1/2 text-xs font-medium transition-all duration-300 ${
                              isHighlighted
                                ? 'text-primary scale-110' 
                                : quarter.active 
                                  ? 'text-gray-500' 
                                  : 'text-gray-400'
                            }`}
                            style={{ top: `${totalIndex}px` }}
                          >
                            {quarter.period}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              

              
              <div className="pr-8">
                <div className="roadmap-container relative flex flex-col gap-8">
                  {/* Alpha (MVP) Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="alpha">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('alpha')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-primary text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('alpha'); }}>
                          Alpha (MVP)
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Basic Contract Workflows
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Smart Contract Automation Engine
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Basic UI/UX
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                DocuSign Integration
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Algorand Integration
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">BUILD</div>
                      </div>
                    </div>
                  </div>

                  {/* Beta Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="beta">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('beta')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-primary text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('beta'); }}>
                          Beta
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Advanced Contract Workflows
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Extended 3rd Party Integrations
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Dashboarding & Analytics
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Early Adopter Program Opens
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                KYC & User Identification
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">PILOT</div>
                      </div>
                    </div>
                  </div>

                  {/* Production Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="production">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('production')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-primary text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('production'); }}>
                          Production
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Production UAT
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Property Records On Chain
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Web3 Property Search
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                AI-Driven Fraud Detection
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Cryptographic Key Signature Engine
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">LAUNCH</div>
                      </div>
                    </div>
                  </div>

                  {/* Fast Follows Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="fast-follows">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('fast-follows')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-gray-600 text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('fast-follows'); }}>
                          Fast Follows
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                AI Doc Parsing & Contract Builder
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Claim On Demand Title Tokenization
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Advanced AI Integration
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">ENHANCE UTILITY</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobilize Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="mobilize">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('mobilize')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-primary text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('mobilize'); }}>
                          Mobilize
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Escra Passport
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Title Abstractor Engine
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                V1 Companion App
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">STREAMLINE</div>
                      </div>
                    </div>
                  </div>

                  {/* Collaborate Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="collaborate">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('collaborate')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-primary text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('collaborate'); }}>
                          Collaborate
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Custodial & Escrow Partner Integrations
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Chainlink Oracle Deployment
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                MSB Readiness
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                SOC I & SOC II Readiness
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">INFRASTRUCTURE & TRUST</div>
                      </div>
                    </div>
                  </div>

                  {/* Expand Phase */}
                  <div className="roadmap-card transform transition-all duration-700 ease-out" data-phase="expand">
                    <div className="relative group cursor-pointer flex items-start gap-8" onClick={() => setCurrentPhase('expand')}>
                      <div className="flex-shrink-0 w-32">
                        <div className="bg-primary text-white rounded-full px-8 py-4 text-center font-semibold shadow-lg transform transition-all duration-300 group-hover:shadow-xl whitespace-nowrap h-12 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentPhase('expand'); }}>
                          Expand
                        </div>
                      </div>
                      <div className="w-[672px] bg-white rounded-xl p-8 shadow-lg border border-gray-200 transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-80">
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Contract Triggered Settlement
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Jurisdiction Expansion
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3">
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                Cross Chain Settlement
                              </li>
                              <li className="text-gray-600 text-sm leading-relaxed flex items-start">
                                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                                API & White Label
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-sm font-medium text-primary">SCALE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <div className="mt-20 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Partners
              </h2>
              <p className="text-gray-600 text-base max-w-2xl mx-auto">
                Trusted by industry leaders & built on proven technology
              </p>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center">
                  <img 
                    src="/assets/algorand_logo_mark_black.png" 
                    alt="Algorand" 
                    className="h-16 w-auto"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Algorand Foundation</h3>
                  <p className="text-sm text-gray-600">Pure proof-of-stake blockchain platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="/primary escra (color) copy.png"
                  alt="ESCRA Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Enterprise-grade contract lifecycle management with blockchain-backed security, identity verification, and automated execution
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">About</a></li>
                <li>
                  <a 
                    href="#" 
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowContactEmail(!showContactEmail);
                    }}
                  >
                    Contact
                  </a>
                  {/* Contact Email */}
                  {showContactEmail && (
                    <div className="mt-2 pt-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-600 font-bold">info@escra.io</div>
                        <div className="relative">
                          <button
                            onClick={copyEmailToClipboard}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                            onMouseEnter={() => setHoveredEmail(true)}
                            onMouseLeave={() => setHoveredEmail(false)}
                            aria-label="Copy email address"
                          >
                            <HiOutlineDuplicate className="w-4 h-4" />
                          </button>
                          {copiedEmail && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                              Copied!
                            </div>
                          )}
                          {hoveredEmail && !copiedEmail && (
                            <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none z-10">
                              Copy
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Resources</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Real Estate</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Corporate</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Finance</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <p className="text-sm text-gray-600 text-center">
              © 2025 Escra. All rights reserved. Built on Algorand.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
