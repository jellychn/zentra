import { useEffect } from 'react'

export const useCleanUp = ({
  interactionTimeoutRef,
  resetTimeoutRef
}: {
  interactionTimeoutRef
  resetTimeoutRef
}): void => {
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])
}
