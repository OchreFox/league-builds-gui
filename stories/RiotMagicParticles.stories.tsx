import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import RiotMagicParticles from '../components/ChampionPicker/RiotMagicParticles'

export default {
  title: 'BuildMaker/ChampionPicker/RiotMagicParticles',
  component: RiotMagicParticles,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: 0,
        max: 1000,
        step: 1,
      },
    },
    height: {
      control: {
        type: 'range',
        min: 0,
        max: 1000,
        step: 1,
      },
    },
  },
} as ComponentMeta<typeof RiotMagicParticles>

const Template: ComponentStory<typeof RiotMagicParticles> = (args) => <RiotMagicParticles {...args} />

export const Default = Template.bind({})
Default.args = {}
