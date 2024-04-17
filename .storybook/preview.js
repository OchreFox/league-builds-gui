import { Provider } from 'react-redux'

import store from '../components/store/store'
import '../styles/globals.css'
import githubTheme from './github-theme'

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    current: 'dark',
    dark: { ...githubTheme },
  },
}

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
]
