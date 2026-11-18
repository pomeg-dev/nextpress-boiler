"use client"

import React from "react";
import classNames from "classnames";

type LoaderProps = {
  isLoading: boolean;
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({
  isLoading,
  className,
}) => {
  if (!isLoading) return null;
  return (
    <div className={classNames(
      "fixed inset-0 z-[999] flex flex-col items-center justify-center bg-surface/80",
      className
    )}>
      <div role="status" aria-label="Loading" className="size-12 animate-spin rounded-full border-4 border-solid border-accent-fill border-t-transparent motion-reduce:animate-none"></div>
    </div>
  );
};

export default Loader;
