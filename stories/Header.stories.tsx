import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Header from '../components/Header'

export default {
  title: 'Basic/Header',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = () => <Header />

export const Default = Template.bind({})
