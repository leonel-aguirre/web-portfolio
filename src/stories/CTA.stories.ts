import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"

import { CTA } from "./CTA"

const meta = {
  title: "Example/CTA",
  component: CTA,
  parameters: {
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
  },
} satisfies Meta<typeof CTA>

export default meta

type Story = StoryObj<typeof meta>

export const SmallMagenta: Story = {
  args: {
    label: "BUTTON",
    size: "small",
    color: CTA.COLORS.MAGENTA,
  },
}

export const SmallViolet: Story = {
  args: {
    label: "BUTTON",
    size: "small",
    color: CTA.COLORS.VIOLET,
  },
}

export const SmallCyan: Story = {
  args: {
    label: "BUTTON",
    size: "small",
    color: CTA.COLORS.CYAN,
  },
}

export const LargeMagenta: Story = {
  args: {
    label: "BUTTON",
    size: "large",
    color: CTA.COLORS.MAGENTA,
  },
}

export const LargeViolet: Story = {
  args: {
    label: "BUTTON",
    size: "large",
    color: CTA.COLORS.VIOLET,
  },
}

export const LargeCyan: Story = {
  args: {
    label: "BUTTON",
    size: "large",
    color: CTA.COLORS.CYAN,
  },
}
