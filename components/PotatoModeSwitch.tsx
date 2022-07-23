import { cx } from '@emotion/css'
import { Switch } from '@headlessui/react'
import { useContext } from 'react'

import { PotatoModeContext } from './hooks/PotatoModeStore'

export default function PotatoModeSwitch() {
  // Get the context state from the provider
  const { state, dispatch } = useContext(PotatoModeContext)

  // Toggle the state
  const toggleState = () => {
    if (state.enabled) {
      dispatch({ type: 'UNSET_POTATO_MODE' })
    } else {
      dispatch({ type: 'SET_POTATO_MODE' })
    }
  }

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={state.enabled}
        onChange={toggleState}
        onClick={toggleState}
        className={cx(
          state.enabled ? 'bg-brand-default' : 'bg-gray-500',
          'relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 motion-reduce:transition-none'
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={cx(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            state.enabled && 'translate-x-5'
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-200">Potato mode </span>
        <span className="text-sm text-gray-400">(Reduce graphics)</span>
      </Switch.Label>
    </Switch.Group>
  )
}
