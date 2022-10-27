import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ChampionPickerOverlay from '../components/ChampionPicker/ChampionPickerOverlay'
import { Tag } from '../types/Champions'

export default {
  title: 'BuildMaker/ChampionPicker/Overlay',
  component: ChampionPickerOverlay,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    show: {
      control: {
        type: 'boolean',
      },
    },
    categoryFilter: {
      options: Object.values(Tag),
      control: {
        type: 'select',
      },
    },
    searchQuery: {
      control: {
        type: 'text',
      },
    },
  },
} as ComponentMeta<typeof ChampionPickerOverlay>

const Template: ComponentStory<typeof ChampionPickerOverlay> = (args) => <ChampionPickerOverlay {...args} />

export const Default = Template.bind({})
Default.args = {
  show: true,
  categoryFilter: Tag.All,
  searchQuery: '',
}
