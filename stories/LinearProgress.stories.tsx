import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import LinearProgress from '@/components/basic/LinearProgress'

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
} as Meta<typeof LinearProgress>

const Template: StoryFn<typeof LinearProgress> = (args) => <LinearProgress {...args} />

export const Default = Template.bind({})
Default.args = {
  show: true,
}
