import { create } from '@storybook/theming'

import logo from '../public/icon.png'

export default create({
  base: 'dark',
  brandTitle: 'OchreFox',
  brandUrl: 'https://ochrefox.net',
  brandImage: logo,
  appBg: '#0d1117',
  appContentBg: '#161b22',
})
