import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import LinearProgress from '../components/LinearProgress'

export default {
  title: 'Basic/LinearProgress',
  component: LinearProgress,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  argTypes: {
    show: {
      type: 'boolean',
    },
  },
} as ComponentMeta<typeof LinearProgress>

const Template: ComponentStory<typeof LinearProgress> = (args) => <LinearProgress {...args} />

export const Default = Template.bind({})
Default.args = {
  show: true,
}
