"use client";

import { useSyncExternalStore, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const noopSubscribe = () => () => {};

export function ClientSizedChart({ children, className }: Props) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return <div className={className}>{mounted ? children : null}</div>;
}
