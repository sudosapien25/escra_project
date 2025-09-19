import { useState, useEffect, useRef } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [buttonClicked, setButtonClicked] = useState(false)
  const [toastIds, setToastIds] = useState<string[]>([])

  // Limit to maximum 6 notifications
  const displayedToasts = toasts.slice(0, 6)

  // Show button when there are multiple toasts AND button hasn't been clicked for current session
  const showCloseAllButton = displayedToasts.length > 1 && !buttonClicked

  // Use refs to avoid infinite loops
  const toastIdsRef = useRef<string[]>([])
  const buttonClickedRef = useRef(false)

  // Track toast IDs to detect new toast sessions
  useEffect(() => {
    const currentIds = toasts.map(t => t.id)
    
    // If toasts are completely gone, reset for next session
    if (toasts.length === 0) {
      setButtonClicked(false)
      setToastIds([])
      toastIdsRef.current = []
      buttonClickedRef.current = false
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
    // Dismiss all toasts
    dismiss()
  }

  return (
    <ToastProvider>
      {displayedToasts.map(function ({ id, title, description, action, onClick, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} onClick={onClick}>
            <div className="grid gap-1">
              {title && <ToastTitle variant={variant}>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
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
            Close All
          </button>
        </div>
      )}
      
      <ToastViewport className="fixed top-[2.375rem] z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:bottom-[2.375rem] sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
} 