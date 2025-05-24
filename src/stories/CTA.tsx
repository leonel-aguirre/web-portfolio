import "./CTA.css"

import React from "react"

const COLORS = {
  MAGENTA: "magenta",
  VIOLET: "violet",
  CYAN: "cyan",
} as const

// prettier-ignore
type ColorValues = typeof COLORS[keyof typeof COLORS];

export interface CTAProps {
  /** How large should the button be? */
  size?: "small" | "large"
  /** Button contents */
  label: string
  /** CTA Color */
  color: ColorValues
  /** Optional click handler */
  onClick?: () => void
}

export const CTA = ({ size = "small", label, color }: CTAProps) => {
  const buildClassName = (): string => {
    let className = `cta t6 --is-size-${size}`

    if (color) {
      className += ` --is-color-${color}`
    }

    return className
  }

  return (
    <button className={buildClassName()} type="button">
      {label}
    </button>
  )
}

CTA.COLORS = COLORS
