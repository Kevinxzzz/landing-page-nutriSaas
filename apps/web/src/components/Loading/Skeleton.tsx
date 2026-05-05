import { CSSProperties } from "react";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  circle?: boolean;
  style?: CSSProperties;
}

export function Skeleton({
  width,
  height,
  borderRadius,
  className = "",
  circle = false,
  style,
}: SkeletonProps) {
  const mergedStyle: CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
    ...style,
  };

  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.circle : ""} ${className}`}
      style={mergedStyle}
    />
  );
}
