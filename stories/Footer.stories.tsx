import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Footer from 'components/Layout/Footer'

export default {
  title: 'Basic/Footer',
  component: Footer,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Footer>

const Template: ComponentStory<typeof Footer> = () => <Footer />

export const Default = Template.bind({})
