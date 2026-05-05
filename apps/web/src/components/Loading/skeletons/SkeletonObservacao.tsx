import { Skeleton } from "../Skeleton";

export function SkeletonObservacao() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <Skeleton width="100%" height="16px" />
      <Skeleton width="100%" height="16px" />
      <Skeleton width="60%" height="16px" style={{ marginBottom: "8px" }} />
      <Skeleton width="70px" height="20px" borderRadius="100px" />
    </div>
  );
}
