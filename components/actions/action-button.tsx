"use client"

import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getActionExecutionPreview, resolveActionDescription, resolveActionLabel } from "@/lib/actions"
import type { ActionContract } from "@/types/action-contract"
import type { SupportedLocale } from "@/types/module"

function toneToVariant(tone: ActionContract["tone"]): React.ComponentProps<typeof Button>["variant"] {
  if (tone === "danger") return "destructive"
  if (tone === "primary") return "default"
  return "secondary"
}

export interface ActionButtonProps {
  action: ActionContract
  locale: SupportedLocale
  href?: string
  icon?: React.ReactNode
  size?: React.ComponentProps<typeof Button>["size"]
  className?: string
  onClick?: (action: ActionContract) => void
}

export function ActionButton({ action, locale, href, icon, size = "sm", className, onClick }: ActionButtonProps) {
  const preview = getActionExecutionPreview(action)
  const label = resolveActionLabel(action, locale)
  const description = resolveActionDescription(action, locale)

  const title =
    preview.placeholderNotice
      ? locale === "zh"
        ? preview.placeholderNotice.zh
        : preview.placeholderNotice.en
      : description

  const disabled = !preview.canExecute

  const content = (
    <>
      {icon ? <span data-icon="inline-start">{icon}</span> : null}
      <span className="max-w-[14rem] truncate">{label}</span>
    </>
  )

  if (href && !disabled) {
    return (
      <Button
        asChild
        size={size}
        variant={toneToVariant(action.tone)}
        className={cn(action.isPlaceholder ? "opacity-70" : null, className)}
        title={title}
      >
        <Link href={href} onClick={() => onClick?.(action)}>
          {content}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size={size}
      variant={toneToVariant(action.tone)}
      disabled={disabled}
      className={cn(action.isPlaceholder ? "opacity-70" : null, className)}
      title={title}
      onClick={() => {
        if (disabled) return
        onClick?.(action)
      }}
    >
      {content}
    </Button>
  )
}
