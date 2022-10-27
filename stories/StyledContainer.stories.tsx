import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import StyledContainer from '../components/layout/StyledContainer'

export default {
  title: 'Layout/StyledContainer',
  component: StyledContainer,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} as ComponentMeta<typeof StyledContainer>

const Template: ComponentStory<typeof StyledContainer> = (args) => <StyledContainer {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'StyledContainer content',
}
