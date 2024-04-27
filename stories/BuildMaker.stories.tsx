import { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import { ItemBuild } from '@/components/ItemBuild/ItemBuild'

export default {
  title: 'BuildMaker',
  component: ItemBuild,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof ItemBuild>

const Template: StoryFn<typeof ItemBuild> = () => <ItemBuild />

export const Default = Template.bind({})
Default.args = {}
