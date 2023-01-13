import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { ItemBuild } from 'components/ItemBuild/ItemBuild'

export default {
  title: 'BuildMaker',
  component: ItemBuild,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ItemBuild>

const Template: ComponentStory<typeof ItemBuild> = () => <ItemBuild />

export const Default = Template.bind({})
Default.args = {}
