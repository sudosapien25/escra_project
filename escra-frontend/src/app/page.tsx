'use client';

import Link from 'next/link';
import Image from 'next/image';
import DecryptedText from '@/components/DecryptedText';
import { HiMiniChevronRight } from 'react-icons/hi2';
import { HiOutlineDuplicate } from 'react-icons/hi';
import VantaBackground from '@/components/VantaBackground';
import GlobalNavigation from '@/components/layout/GlobalNavigation';

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
            <a href="#" className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-primary hover:text-white hover:italic transition-all flex items-center font-medium">
              Learn more <HiMiniChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          
          <div className="card-glow max-w-3xl w-full rounded-lg overflow-hidden shadow-xl border border-gray-800 bg-black">
            {/* Editor Header with Traffic Lights */}
            <div className="bg-black px-4 py-2 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-yellow-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-600"></div>
                </div>
                <div className="text-gray-300 font-medium">contract.algo</div>
              </div>
              <button className="text-gray-300 hover:text-gray-100 px-2 py-1 rounded border border-gray-700 hover:bg-gray-900 transition text-xs">
                <HiOutlineDuplicate className="h-3 w-3" />
              </button>
            </div>
            
            {/* Code Editor Section */}
            <div className="bg-black flex divide-x divide-gray-800">
              {/* Line Numbers */}
              <div className="bg-black text-gray-500 py-3 px-2 text-right select-none w-10">
                <div>1</div>
                <div>2</div>
                <div>3</div>
              </div>
              
              {/* Code Content */}
              <div className="py-3 px-3 overflow-auto w-full bg-black text-left">
                <pre><code className="text-gray-400">{`#pragma version 8

// Check sender
txn Sender
addr 7JOPVEP3ABJUW5YZ5WFIONLPWTZ5MYX5HFK4K7JLGSIAG7RRB42MNLQ224
==
assert`}</code></pre>
              </div>
            </div>
            
            {/* Terminal Section */}
            <div className="bg-black p-3 border-t border-gray-800 text-left">
              <div className="text-gray-300">
                <div className="mb-1"><span className="text-green-400">$</span> truffle compile</div>
                <div className="mb-1 text-blue-300">{" > "}Compiling contracts...</div>
                <div className="text-green-400">{" > "}Contract compiled successfully</div>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="bg-black px-3 py-1 border-t border-gray-800 flex justify-between items-center text-gray-400 text-xs">
              <div className="flex items-center space-x-3">
                <span>TEAL</span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>Ln 5, Col 7</span>
                <span>Spaces: 2</span>
                <span>5 lines</span>
              </div>
            </div>
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
        </div>
      </div>
    </>
  );
}
