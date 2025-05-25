import React from 'react';
import clsx from 'clsx';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className,
  ...props
}) => {
  return (
    <div className={clsx('flex items-center', className)} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={clsx(
                'flex items-center justify-center w-8 h-8 rounded-full border-2',
                index < currentStep
                  ? 'bg-primary border-primary text-white'
                  : index === currentStep
                  ? 'border-primary text-primary'
                  : 'border-gray-300 text-gray-500'
              )}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="ml-2 text-sm font-medium text-gray-900">
              {step.label}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={clsx(
                'flex-auto border-t-2 mx-4',
                index < currentStep ? 'border-primary' : 'border-gray-300'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

Stepper.displayName = 'Stepper'; 