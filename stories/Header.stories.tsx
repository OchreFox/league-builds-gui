import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import Header from '@/components/Layout/Header/Header'

export default {
  title: 'Basic/Header',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as Meta<typeof Header>

const Template: StoryFn<typeof Header> = () => <Header />

export const Default = Template.bind({})
