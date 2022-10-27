import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BuildMaker } from '../components/BuildMaker'

export default {
  title: 'BuildMaker',
  component: BuildMaker,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof BuildMaker>

const Template: ComponentStory<typeof BuildMaker> = () => <BuildMaker />

export const Default = Template.bind({})
Default.args = {}
