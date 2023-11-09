import React, { KeyboardEvent, MouseEvent, TouchEvent, useCallback, useRef } from 'react'

export function useLongPress(
  callback: (e: MouseEvent | TouchEvent | KeyboardEvent) => void,
  startCallback: () => void,
  cancelCallback: () => void,
  duration: number = 500
): React.HTMLAttributes<HTMLElement> {
  // This will be a reference to our `setTimeout` counter, so we can clear it
  // if the user moves or releases their pointer.
  const timeout = useRef<NodeJS.Timeout | null>(null)

  // Create an event handler for mouse down and touch start events and keydown events.
  // We wrap the handler in the `useCallback` hook and pass `callback` and `duration` as
  // dependencies so it only creates a new callback if either of these changes.
  const onPressStart = useCallback(
    (event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      // Detect if event is of type KeyboardEvent
      if (event.type === 'keydown') {
        const keyboardEvent = event as KeyboardEvent<HTMLElement>
        // If event is of type KeyboardEvent, check if key is Space or Enter and if event is not a repeat
        if ((keyboardEvent.key !== ' ' && keyboardEvent.key !== 'Enter') || keyboardEvent.repeat) {
          return
        }
      } else {
        // Prevent the browser's default response to this event. On mobile browsers
        // long presses are used . This will also block touch scrolling - a more
        // robust implementation will take this into account, but this is fine
        // for prototyping.
        event.preventDefault()
      }

      // Start a timeout that, after the provided `duration`, will fire the
      // supplied callback.
      startCallback()
      timeout.current = setTimeout(() => callback(event), duration)
    },
    [callback, duration, startCallback]
  )

  // This function, when called, will cancel the timeout and thus end the
  // gesture. We provide an empty dependency array as we never want this
  // function to change for the lifecycle of the component.
  const cancelTimeout = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
      cancelCallback()
    }
  }, [cancelCallback])

  return {
    onMouseDown: onPressStart,
    onTouchStart: onPressStart,
    onKeyDown: onPressStart,

    onMouseLeave: cancelTimeout,
    onMouseUp: cancelTimeout,
    onTouchEnd: cancelTimeout,
    onTouchCancel: cancelTimeout,
    onKeyUp: cancelTimeout,
  }
}
