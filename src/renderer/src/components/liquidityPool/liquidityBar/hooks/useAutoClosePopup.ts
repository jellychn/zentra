import { useEffect } from 'react'

export const useAutoClosePopup = ({
  clicked,
  clickTimeoutRef,
  setClicked
}: {
  clicked
  clickTimeoutRef
  setClicked
}): void => {
  useEffect(() => {
    if (clicked) {
      clickTimeoutRef.current = setTimeout(() => {
        setClicked(false)
      }, 5000)
    }
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [clickTimeoutRef, clicked, setClicked])
}
