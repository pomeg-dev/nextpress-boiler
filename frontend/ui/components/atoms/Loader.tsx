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
      "fixed w-screen h-screen bg-white/80 top-0 left-0 z-[999] flex flex-col justify-center items-center",
      className
    )}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
