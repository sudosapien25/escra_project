import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  helperText?: string;
}

export const Select_new: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  error = false,
  helperText,
}) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={clsx('relative', className)}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus:ring-2 focus:ring-primary',
              error ? 'border-red-500' : 'border-gray-300',
              disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-primary'
            )}
          >
            <span className={clsx('block truncate', !selectedOption && 'text-gray-500')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FaChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary/10 text-primary' : 'text-gray-900',
                      option.disabled && 'cursor-not-allowed opacity-50'
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={clsx('block truncate', selected && 'font-medium')}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <FaCheck className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {helperText && (
        <p className={clsx('mt-1 text-sm', error ? 'text-red-500' : 'text-gray-500')}>
          {helperText}
        </p>
      )}
    </div>
  );
}; 