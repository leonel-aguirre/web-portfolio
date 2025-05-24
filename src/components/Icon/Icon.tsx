import React from "react"

import { faBoltLightning, faCode } from "@fortawesome/free-solid-svg-icons"

export const ICONS = ["BOLT_LIGHTNING", "CODE"] as const

export const ICON_ELEMENTS = {
  BOLT_LIGHTNING: faBoltLightning,
  CODE: faCode,
} as const

export const Icon = () => {
  return (
    // TODO: Add icon logic.
    <div>
      <h1>Icon</h1>
      <p>This is an icon component.</p>
    </div>
  )
}
