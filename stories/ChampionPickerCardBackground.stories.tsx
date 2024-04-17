import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import BackgroundRenderer from '@/components/ChampionPicker/ChampionPickerCardBackground'

export default {
  title: 'BuildMaker/ChampionPicker/CardBackground',
  component: BackgroundRenderer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof BackgroundRenderer>

const Template: StoryFn<typeof BackgroundRenderer> = () => <BackgroundRenderer />

export const Default = Template.bind({})
