'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TbBuildingEstate, TbShoppingBagEdit, TbWorld, TbContract, TbRouteSquare, TbUsersGroup, TbMessageQuestion, TbBrandDiscord, TbBrandYoutube, TbInfoSquare } from 'react-icons/tb';
import { HiOutlineDuplicate } from 'react-icons/hi';
import { MdOutlineSportsFootball, MdOutlineMovieFilter, MdOutlineHealthAndSafety, MdOutlineGeneratingTokens } from 'react-icons/md';
import { LuConstruction, LuBriefcaseBusiness, LuClipboardCheck, LuBrainCircuit, LuCircuitBoard, LuListEnd, LuVideo, LuBookOpenText, LuNewspaper, LuLinkedin, LuMic, LuContact, LuBuilding2 } from 'react-icons/lu';
import { GrMoney, GrUserWorker, GrStatusInfo } from 'react-icons/gr';
import { VscLaw } from 'react-icons/vsc';
import { LiaToolsSolid } from 'react-icons/lia';
import { HiOutlineChip, HiOutlineKey } from 'react-icons/hi';
import { PiLinkSimpleBold, PiLockKeyBold, PiListMagnifyingGlassBold } from 'react-icons/pi';
import { IconType } from 'react-icons';
import { FaXTwitter } from 'react-icons/fa6';
import { SiInstagram } from 'react-icons/si';
import { RiTelegram2Line } from 'react-icons/ri';

interface IndustryOption {
  value: string;
  label: string;
  icon: IconType;
  description: string;
}

const INDUSTRIES: IndustryOption[] = [
  { value: 'real_estate', label: 'Real Estate', icon: TbBuildingEstate, description: 'Property sale & lease agreements' },
  { value: 'corporate', label: 'Corporate', icon: LuBriefcaseBusiness, description: 'Enterprise, employment & vendor agreements' },
  { value: 'finance', label: 'Finance', icon: GrMoney, description: 'Advisory, Lending, M&A agreements' },
  { value: 'legal', label: 'Legal', icon: VscLaw, description: 'Legal services & compliance agreements' },
  { value: 'supply_chain', label: 'Logistics', icon: TbWorld, description: 'Transportation, supply-chain & warehousing agreements' },
  { value: 'labor', label: 'Labor', icon: GrUserWorker, description: 'Dispute resolution, collective-bargaining & union agreements' },
  { value: 'entertainment', label: 'Entertainment', icon: MdOutlineMovieFilter, description: 'Media, artist & performance agreements' },
  { value: 'athletics', label: 'Athletics', icon: MdOutlineSportsFootball, description: 'Front-offices, leagues, player contracts & endorsements' },
  { value: 'construction', label: 'Construction', icon: LuConstruction, description: 'Building, project & subcontractor agreements' },
  { value: 'healthcare', label: 'Healthcare', icon: MdOutlineHealthAndSafety, description: 'Medical provider & health service agreements' },
  { value: 'manufacturing', label: 'Manufacturing', icon: LiaToolsSolid, description: 'Production, supply & equipment agreements' },
  { value: 'technology', label: 'Technology', icon: HiOutlineChip, description: 'IT service, vendor & software licensing agreements' }
];

export default function GlobalNavigation() {
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showSocialMedia, setShowSocialMedia] = useState(false);
  const [showContactEmail, setShowContactEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hoveredEmail, setHoveredEmail] = useState(false);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('info@escra.io');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1500);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  };

  return (
    <nav className="container mx-auto px-6 py-8">
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
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowPlatformDropdown(true)}
            onMouseLeave={() => setShowPlatformDropdown(false)}
          >
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm cursor-pointer font-bold">
              Platform
            </a>
            {showPlatformDropdown && (
                              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/3 pt-6 w-screen max-w-[72rem] z-50"
                onMouseEnter={() => setShowPlatformDropdown(true)}
                onMouseLeave={() => setShowPlatformDropdown(false)}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-6">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div className="border-r border-gray-200 pr-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Features</h3>
                      <div className="space-y-4">
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <TbContract className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Unified Contract Management</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Streamlined creation, preparation & lifecycle management</div>
                          </div>
                        </a>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <LuCircuitBoard className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Blockchain Contract Execution</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Secure smart contract automation & digital records</div>
                          </div>
                        </a>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <HiOutlineKey className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Cryptographic Signature Authentication</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Identity-backed digital signatures with tamper-proof verification</div>
                          </div>
                        </a>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <PiListMagnifyingGlassBold className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Immutable Ledger & Audit Trail</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Complete transaction history & compliance tracking</div>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div>
                      <div className="space-y-4" style={{ marginTop: '2rem' }}>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <PiLockKeyBold className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Quantum Resilient Security</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Future-proof encryption & security protocols</div>
                          </div>
                        </a>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <TbRouteSquare className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Workflow Automation</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Automated tasks, milestones & handoffs</div>
                          </div>
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-[10px] font-medium ml-2">
                            Coming Soon
                          </span>
                        </a>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <LuBrainCircuit className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">AI Risk & Fraud Detection</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Intelligent threat detection & prevention</div>
                          </div>
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-[10px] font-medium ml-2">
                            Coming Soon
                          </span>
                        </a>
                        <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            <MdOutlineGeneratingTokens className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Tokenization</div>
                            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Asset digitization & proof of ownership</div>
                          </div>
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-[10px] font-medium ml-2">
                            Coming Soon
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowIndustriesDropdown(true)}
            onMouseLeave={() => setShowIndustriesDropdown(false)}
          >
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm cursor-pointer font-bold">
              Solutions
            </a>
            {showIndustriesDropdown && (
                              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/3 pt-6 w-screen max-w-[90rem] z-50"
                onMouseEnter={() => setShowIndustriesDropdown(true)}
                onMouseLeave={() => setShowIndustriesDropdown(false)}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-6">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-[0.5fr_0.6fr_0.4fr] gap-6">
                    {/* Column 1 */}
                    <div className="border-r border-gray-200 pr-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Key Sectors</h3>
                      <div className="space-y-4">
                        {INDUSTRIES.slice(0, 4).map((industry) => {
                          const IconComponent = industry.icon;
                          return (
                            <a
                              key={industry.value}
                              href="#"
                              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                              style={{ minHeight: '60px' }}
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-900 group-hover:text-primary">{industry.label}</div>
                                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{industry.description}</div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Specialized Industries</h3>
                      <div className="space-y-4">
                        {INDUSTRIES.slice(4, 8).map((industry) => {
                          const IconComponent = industry.icon;
                          return (
                            <a
                              key={industry.value}
                              href="#"
                              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                              style={{ minHeight: '60px' }}
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-900 group-hover:text-primary">{industry.label}</div>
                                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{industry.description}</div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div>
                      <div className="space-y-4" style={{ marginTop: '2rem' }}>
                        {INDUSTRIES.slice(8, 12).map((industry) => {
                          const IconComponent = industry.icon;
                          return (
                            <a
                              key={industry.value}
                              href="#"
                              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                              style={{ minHeight: '60px' }}
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-900 group-hover:text-primary">{industry.label}</div>
                                <div className="text-xs text-gray-500 mt-1 leading-relaxed">{industry.description}</div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowResourcesDropdown(true)}
            onMouseLeave={() => setShowResourcesDropdown(false)}
          >
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm cursor-pointer font-bold">
              Resources
            </a>
            {showResourcesDropdown && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 pt-6 w-screen max-w-3xl z-50"
                onMouseEnter={() => setShowResourcesDropdown(true)}
                onMouseLeave={() => setShowResourcesDropdown(false)}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-6">
                  <div className="container mx-auto px-6">
                    <div className="grid grid-cols-[1fr_0.7fr] gap-6">
                      {/* Column 1 */}
                      <div className="border-r border-gray-200 pr-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Explore</h3>
                        <div className="space-y-4">
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <LuBookOpenText className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Guides & Tutorials</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Training & learning materials</div>
                            </div>
                          </a>
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <LuVideo className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Demos</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Schedule demos & review on-demand content</div>
                            </div>
                          </a>
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}
                            onClick={(e) => {
                              e.preventDefault();
                              setShowSocialMedia(!showSocialMedia);
                            }}
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <TbUsersGroup className="w-[18px] h-[18px] text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Community</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Join our growing community of users</div>
                            </div>
                          </a>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="relative">
                        <div className="space-y-4" style={{ marginTop: '2rem' }}>
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <TbMessageQuestion className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">FAQs</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Get answers to your questions</div>
                            </div>
                          </a>
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <LuNewspaper className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Blog</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Latest insights & industry updates</div>
                            </div>
                          </a>
                        </div>
                        
                        {/* Social Media Icons */}
                        {showSocialMedia && (
                          <>

                            <div className="flex space-x-1 pl-3 mt-7">
                              <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors group">
                                <FaXTwitter className="w-4 h-4 text-gray-600 group-hover:text-gray-500" />
                              </a>
                              <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors group">
                                <LuLinkedin className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                              </a>
                              <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors group">
                                <TbBrandYoutube className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                              </a>
                              <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors group">
                                <TbBrandDiscord className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                              </a>
                              <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors group">
                                <RiTelegram2Line className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                              </a>
                              <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-50 hover:to-orange-50 transition-colors group">
                                <SiInstagram className="w-4 h-4 text-gray-600 group-hover:text-orange-500" />
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowCompanyDropdown(true)}
            onMouseLeave={() => setShowCompanyDropdown(false)}
          >
            <a href="#" className="text-gray-600 hover:text-black transition-colors text-sm cursor-pointer font-bold">
              Company
            </a>
            {showCompanyDropdown && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 pt-6 w-screen max-w-3xl z-50"
                onMouseEnter={() => setShowCompanyDropdown(true)}
                onMouseLeave={() => setShowCompanyDropdown(false)}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-6">
                  <div className="container mx-auto px-6">
                    <div className="grid grid-cols-[1fr_0.6fr] gap-6">
                      {/* Column 1 */}
                      <div className="border-r border-gray-200 pr-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">About</h3>
                        <div className="space-y-4">
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <GrStatusInfo className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">About</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Learn about our mission & values</div>
                            </div>
                          </a>
                          <a href="#" className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" style={{ minHeight: '60px' }}>
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <LuMic className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Press</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Media coverage & press releases</div>
                            </div>
                          </a>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div>
                        <div className="space-y-4" style={{ marginTop: '2rem' }}>
                          <a 
                            href="#" 
                            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group" 
                            style={{ minHeight: '60px' }}
                            onClick={(e) => {
                              e.preventDefault();
                              setShowContactEmail(!showContactEmail);
                            }}
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              <LuContact className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 group-hover:text-primary">Contact</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">Get in touch with our team</div>
                            </div>
                          </a>
                          
                          {/* Contact Email */}
                          {showContactEmail && (
                            <div className="text-center pt-2">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="text-xs text-gray-600 font-bold">info@escra.io</div>
                                <div className="relative">
                                  <button
                                    onClick={copyEmailToClipboard}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                                    onMouseEnter={() => setHoveredEmail(true)}
                                    onMouseLeave={() => setHoveredEmail(false)}
                                    aria-label="Copy email address"
                                  >
                                    <HiOutlineDuplicate className="w-[14px] h-[14px]" />
                                  </button>
                                  {copiedEmail && (
                                    <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                      Copied!
                                    </div>
                                  )}
                                  {hoveredEmail && !copiedEmail && (
                                    <div className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                                      Copy
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/pricing" className="text-gray-600 hover:text-black transition-colors text-sm font-bold">Pricing</Link>
        </div>
        
        <div className="flex items-center space-x-1">
          <Link href="/login?tab=register" className="px-4 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-primary hover:italic transition-all">
            Sign up
          </Link>
          <Link href="/login" className="px-4 py-2 text-sm border border-black rounded-lg hover:bg-primary hover:text-white hover:border-transparent hover:italic transition-all font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}
