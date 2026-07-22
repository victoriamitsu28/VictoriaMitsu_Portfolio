"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/transitions/TransitionProvider/TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  imageSrc: string;
  transitionLabel: string;
  sourceSelector?: string;
  transitionAccent?: string;
  transitionBackground?: string;
};

export function TransitionLink({
  href,
  imageSrc,
  transitionLabel,
  sourceSelector = "[data-transition-source]",
  transitionAccent = "#f3ede7",
  transitionBackground = "#11100e",
  onClick,
  target,
  children,
  ...rest
}: Props) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const modifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    const externalTarget = target && target !== "_self";

    if (event.button !== 0 || modifiedClick || externalTarget) {
      return;
    }

    const scope = event.currentTarget.closest<HTMLElement>("[data-transition-scope]");
    const sourceElement =
      scope?.querySelector<HTMLElement>(sourceSelector) ??
      event.currentTarget.querySelector<HTMLElement>(sourceSelector) ??
      event.currentTarget;

    event.preventDefault();

    navigate({
      href,
      imageSrc,
      label: transitionLabel,
      sourceElement,
      accent: transitionAccent,
      background: transitionBackground,
    });
  };

  return (
    <Link
      href={href}
      target={target}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
}
