import "./CTA.css"

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { ICONS, ICON_ELEMENTS } from "../Icon/Icon"

const COLORS = {
  MAGENTA: "magenta",
  VIOLET: "violet",
  CYAN: "cyan",
} as const

// prettier-ignore
type ColorValues = typeof COLORS[keyof typeof COLORS];

// prettier-ignore
type IconValues = typeof ICONS[number];

export interface CTAProps {
  /** How large should the button be? */
  size?: "small" | "large"
  /** Button contents */
  label: string
  /** CTA Color */
  color?: ColorValues
  /** Icon */
  icon?: IconValues | undefined
  /** Optional click handler */
  onClick?: () => void
}

const ICON_FONT_SIZE = 14

export const CTA = ({ size = "small", label, color, icon }: CTAProps) => {
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
      {icon && (
        <FontAwesomeIcon
          className="cta__icon"
          icon={ICON_ELEMENTS[icon]}
          fontSize={ICON_FONT_SIZE}
        />
      )}
    </button>
  )
}

CTA.COLORS = COLORS
