import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Button from '../components/basic/Button'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Basic/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    label: {
      type: 'string',
    },
    icon: {
      type: 'string',
    },
    background: {
      control: {
        type: 'text',
      },
    },
    color: {
      control: {
        type: 'text',
      },
    },
    labelReactive: {
      type: 'string',
    },
    iconReactive: {
      type: 'string',
    },
    bgClick: {
      type: 'string',
    },
    colorReactive: {
      type: 'string',
    },
    rounded: {
      options: ['rounded-full', 'rounded-md'],
      control: {
        type: 'radio',
      },
    },
    handleClick: {
      type: 'function',
      action: 'clicked',
    },
  },
  args: {
    layoutId: 'add-block',
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'Button',
  icon: 'tabler:apps',
  background: 'bg-brand-default',
  color: 'text-white',
  reactive: false,
  labelReactive: 'Success',
  iconReactive: 'tabler:check',
  bgClick: 'bg-green-400',
  rounded: 'rounded-md',
}

export const PrimaryRounded = Template.bind({})
PrimaryRounded.args = {
  label: 'Button',
  icon: 'tabler:apps',
  background: 'bg-brand-default',
  color: 'text-white',
  reactive: false,
  labelReactive: 'Success',
  iconReactive: 'tabler:check',
  bgClick: 'bg-green-400',
  rounded: 'rounded-full',
}

export const PrimaryReactive = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PrimaryReactive.args = {
  label: 'Button',
  icon: 'tabler:apps',
  background: 'bg-brand-default',
  color: 'text-white',
  reactive: true,
  labelReactive: 'Success',
  iconReactive: 'tabler:check',
  bgClick: 'bg-green-400',
  colorReactive: 'text-black',
  rounded: 'rounded-md',
}

export const PrimaryReactiveRounded = Template.bind({})
PrimaryReactiveRounded.args = {
  label: 'Button',
  icon: 'tabler:apps',
  background: 'bg-brand-default',
  color: 'text-white',
  reactive: true,
  labelReactive: 'Success',
  iconReactive: 'tabler:check',
  bgClick: 'bg-green-400',
  colorReactive: 'text-black',
  rounded: 'rounded-full',
}
