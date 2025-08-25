import { useState, useEffect, useCallback, useRef } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function ContractsToaster() {
  const { toasts, dismiss, toast } = useToast()
  const [buttonClicked, setButtonClicked] = useState(false)
  const [toastIds, setToastIds] = useState<string[]>([])
  const [remainingToasts, setRemainingToasts] = useState<any[]>([])
  const [isShowingRemaining, setIsShowingRemaining] = useState(false)

  // Limit to maximum 20 notifications (increased from 12)
  const displayedToasts = toasts.slice(0, 20)

  // Show button when there are multiple toasts AND button hasn't been clicked for current session
  const showCloseAllButton = displayedToasts.length > 1 && !buttonClicked

  // Use refs to avoid infinite loops
  const toastIdsRef = useRef<string[]>([])
  const buttonClickedRef = useRef(false)
  const allToastsRef = useRef<any[]>([])

  // Track all toasts to maintain queue
  useEffect(() => {
    allToastsRef.current = toasts
  }, [toasts])

  // Track toast IDs to detect new toast sessions
  useEffect(() => {
    const currentIds = toasts.map(t => t.id)
    
    // If toasts are completely gone, reset for next session
    if (toasts.length === 0) {
      setButtonClicked(false)
      setToastIds([])
      toastIdsRef.current = []
      buttonClickedRef.current = false
      setIsShowingRemaining(false)
      setRemainingToasts([])
    }
    // If we have new toasts (different IDs), this is a new session
    else if (displayedToasts.length > 1) {
      const hasNewToasts = currentIds.some(id => !toastIdsRef.current.includes(id))
      if (hasNewToasts && buttonClickedRef.current) {
        setButtonClicked(false)
        buttonClickedRef.current = false
      }
      if (hasNewToasts) {
        setToastIds(currentIds)
        toastIdsRef.current = currentIds
      }
    }
  }, [toasts, displayedToasts.length])

  // Update refs when state changes
  useEffect(() => {
    buttonClickedRef.current = buttonClicked
  }, [buttonClicked])

  useEffect(() => {
    toastIdsRef.current = toastIds
  }, [toastIds])

  const handleCloseAll = () => {
    // Mark button as clicked for this session
    setButtonClicked(true)
    
    // Store remaining toasts if there are more than displayed
    const remaining = allToastsRef.current.slice(20)
    if (remaining.length > 0) {
      setRemainingToasts(remaining)
    }
    
    // Dismiss all current toasts
    dismiss()
  }

  // Show remaining toasts when current toasts are dismissed
  useEffect(() => {
    if (toasts.length === 0 && remainingToasts.length > 0 && !isShowingRemaining) {
      setIsShowingRemaining(true)
      
      // Show notification that remaining toasts are coming
      toast({
        title: "More Notifications",
        description: `Showing ${remainingToasts.length} additional notification(s)...`,
        duration: 3000,
      })
      
      // Show remaining toasts with delay
      remainingToasts.forEach((toastData, index) => {
        setTimeout(() => {
          toast({
            title: toastData.title,
            description: toastData.description,
            duration: toastData.duration || 30000,
            onClick: toastData.onClick,
            variant: toastData.variant
          })
        }, (index + 1) * 200) // 200ms delay between remaining toasts
      })
      
      // Clear remaining toasts after showing
      setTimeout(() => {
        setRemainingToasts([])
        setIsShowingRemaining(false)
      }, remainingToasts.length * 200 + 1000)
    }
  }, [toasts.length, remainingToasts, isShowingRemaining, toast])

  return (
    <ToastProvider>
      {displayedToasts.map(function ({ id, title, description, action, onClick, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} onClick={onClick}>
            <div className="grid gap-1">
              {title && <ContractsToastTitle variant={variant}>{title}</ContractsToastTitle>}
              {description && (
                <ContractsToastDescription>{description}</ContractsToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      
      {/* Close All Button - shows only when there are multiple toasts */}
      {showCloseAllButton && (
        <div className="fixed top-0 right-0 z-[101] p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex sm:justify-end md:max-w-[420px] w-full">
          <button
            onClick={handleCloseAll}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow-lg transition-all duration-200 border border-primary/20 hover:shadow-xl w-full max-w-[388px]"
            style={{ fontFamily: 'Avenir, sans-serif' }}
            aria-label="Close all notifications"
          >
            {allToastsRef.current.length > 20 ? `Close All (${allToastsRef.current.length - 20} more coming)` : 'Close All'}
          </button>
        </div>
      )}
      
      <ToastViewport className="fixed top-[2.375rem] z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-[2.375rem] sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}

// Custom ToastTitle for contracts page - using teal color like workflows page, red for voided
const ContractsToastTitle = ({ children, variant, ...props }: any) => (
  <div
    className={`text-sm font-semibold ${
      variant === "voided" ? "text-red-600 dark:text-red-400" : "text-primary"
    }`}
    style={{ fontFamily: 'Avenir, sans-serif' }}
    {...props}
  >
    {children}
  </div>
)

// Custom ToastDescription for contracts page
const ContractsToastDescription = ({ children, ...props }: any) => (
  <div
    className="text-xs opacity-90 text-gray-700 dark:text-gray-300"
    style={{ fontFamily: 'Avenir, sans-serif' }}
    {...props}
  >
    {children}
  </div>
)


