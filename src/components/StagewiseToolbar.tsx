'use client';

import { useEffect, useRef } from 'react';
import { initToolbar } from '@stagewise/toolbar';

export default function StagewiseToolbar() {
  const initialized = useRef(false);

  useEffect(() => {
    console.log('StagewiseToolbar: Component mounted');
    console.log('NODE_ENV:', process.env.NODE_ENV);

    if (!initialized.current && process.env.NODE_ENV === 'development') {
      console.log('StagewiseToolbar: Initializing toolbar...');
      try {
        initToolbar({
          plugins: []
        });
        console.log('StagewiseToolbar: Initialization successful');
        initialized.current = true;
      } catch (error) {
        console.error('StagewiseToolbar: Initialization failed:', error);
      }
    }
  }, []);

  return null;
} 