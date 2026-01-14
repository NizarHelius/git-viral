"use client";
import React from "react";

type Props = {
  size?: number; // px
  color?: string; // CSS color
  className?: string;
};

export default function Loader({
  size = 20,
  color = "#ffffff",
  className = "",
}: Props) {
  const style: React.CSSProperties = {
    // CSS custom properties for the loader
    ["--uib-size" as any]: `${size}px`,
    ["--uib-color" as any]: color,
  };

  return (
    <div className={`three-body-wrapper ${className}`} style={style}>
      <div className="three-body">
        <div className="three-body__dot" />
        <div className="three-body__dot" />
        <div className="three-body__dot" />
      </div>
    </div>
  );
}
