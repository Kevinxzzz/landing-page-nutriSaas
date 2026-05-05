import { Skeleton } from "../Skeleton";

export function SkeletonTable() {
  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Skeleton width="100px" height="16px" />
          <Skeleton width="150px" height="16px" />
          <Skeleton width="80px" height="16px" />
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Skeleton width="40px" height="40px" borderRadius="8px" />
          <Skeleton width="200px" height="18px" />
          <Skeleton width="100px" height="18px" />
          <div style={{ flex: 1 }} />
          <Skeleton width="32px" height="32px" borderRadius="6px" />
        </div>
      ))}
    </div>
  );
}
