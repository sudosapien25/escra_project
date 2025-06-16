import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { HiX } from 'react-icons/hi';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalPosition = 'center' | 'top' | 'bottom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  position?: ModalPosition;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  hideBackdrop?: boolean;
  backdropClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-full mx-4',
};

const positionClasses: Record<ModalPosition, string> = {
  center: 'items-center',
  top: 'items-start pt-16',
  bottom: 'items-end pb-16',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footer,
  icon,
  hideBackdrop = false,
  backdropClassName,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={clsx("relative z-50", className)}
        onClose={closeOnBackdropClick ? onClose : () => {}}
      >
        {/* Backdrop */}
        {!hideBackdrop && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={clsx("fixed inset-0 bg-black bg-opacity-25", backdropClassName)} />
          </Transition.Child>
        )}

        <div className="fixed inset-0 overflow-y-auto">
          <div className={clsx(
            "flex min-h-full justify-center p-4 text-center",
            positionClasses[position]
          )}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={clsx(
                "w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                sizeClasses[size]
              )}>
                {/* Header */}
                {(title || description || showCloseButton) && (
                  <div className={clsx(
                    "flex items-start justify-between mb-4",
                    headerClassName
                  )}>
                    <div className="flex items-center gap-3">
                      {icon && (
                        <div className="flex-shrink-0">
                          {icon}
                        </div>
                      )}
                      <div>
                        {title && (
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                    {showCloseButton && (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <HiX className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className={clsx("mt-2", bodyClassName)}>
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className={clsx(
                    "mt-6 flex justify-end gap-3",
                    footerClassName
                  )}>
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.displayName = 'Modal'; 