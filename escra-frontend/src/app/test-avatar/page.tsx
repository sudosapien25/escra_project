'use client';

import React from 'react';
import { Avatar_new } from '@/components/common/Avatar_new';

export default function TestAvatarPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Avatar Component Test Page</h1>
      <div className="flex flex-wrap gap-8 items-center">
        {/* Image Avatar (lg) */}
        <div className="flex flex-col items-center">
          <Avatar_new
            src="https://randomuser.me/api/portraits/men/32.jpg"
            name="John Doe"
            size="lg"
          />
          <span className="mt-2 text-sm">Image (lg)</span>
        </div>
        {/* Fallback Initials */}
        <div className="flex flex-col items-center">
          <Avatar_new name="Jane Smith" size="lg" />
          <span className="mt-2 text-sm">Initials (lg)</span>
        </div>
        {/* Custom Colors */}
        <div className="flex flex-col items-center">
          <Avatar_new name="Alice Brown" size="md" backgroundColor="bg-primary" textColor="text-white" />
          <span className="mt-2 text-sm">Custom Color (md)</span>
        </div>
        {/* Small Size */}
        <div className="flex flex-col items-center">
          <Avatar_new name="Bob" size="sm" />
          <span className="mt-2 text-sm">Initials (sm)</span>
        </div>
        {/* Image Avatar (sm) */}
        <div className="flex flex-col items-center">
          <Avatar_new
            src="https://randomuser.me/api/portraits/men/65.jpg"
            name="Sam Lee"
            size="sm"
          />
          <span className="mt-2 text-sm">Image (sm)</span>
        </div>
        {/* Image Avatar (md) */}
        <div className="flex flex-col items-center">
          <Avatar_new
            src="https://randomuser.me/api/portraits/women/44.jpg"
            name="Emily Clark"
            size="md"
          />
          <span className="mt-2 text-sm">Image (md)</span>
        </div>
        {/* Broken Image Fallback */}
        <div className="flex flex-col items-center">
          <Avatar_new src="/broken-link.jpg" name="Chris Evans" size="md" />
          <span className="mt-2 text-sm">Broken Image (md)</span>
        </div>
      </div>
    </div>
  );
} 