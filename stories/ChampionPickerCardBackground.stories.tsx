import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import BackgroundRenderer from '../components/ChampionPicker/ChampionPickerCardBackground'

export default {
  title: 'BuildMaker/ChampionPicker/CardBackground',
  component: BackgroundRenderer,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof BackgroundRenderer>

const Template: ComponentStory<typeof BackgroundRenderer> = (args) => <BackgroundRenderer {...args} />

export const Default = Template.bind({})
