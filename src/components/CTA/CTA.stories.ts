import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"

import { ICONS } from "../Icon/Icon"
import { CTA } from "./CTA"

const meta = {
  title: "Example/CTA",
  component: CTA,
  parameters: {
    backgrounds: {
      default: "dark",
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
  argTypes: {
    color: {
      control: {
        type: "radio",
      },
      options: Object.values(CTA.COLORS),
    },
    icon: {
      control: {
        type: "multi-select",
      },
      options: [undefined, ...Object.values(ICONS)],
    },
  },
} satisfies Meta<typeof CTA>

export default meta

type Story = StoryObj<typeof meta>

export const SmallSolidMagenta: Story = {
  args: {
    label: "BUTTON",
    size: "small",
    color: CTA.COLORS.MAGENTA,
    style: "solid",
  },
}

export const LargeSolidViolet: Story = {
  args: {
    label: "BUTTON",
    size: "large",
    color: CTA.COLORS.VIOLET,
    style: "solid",
  },
}

export const SmallOutlineCyan: Story = {
  args: {
    label: "BUTTON",
    size: "small",
    color: CTA.COLORS.CYAN,
    style: "outline",
  },
}

export const LargeOutlineViolet: Story = {
  args: {
    label: "BUTTON",
    size: "large",
    color: CTA.COLORS.VIOLET,
    style: "outline",
  },
}
