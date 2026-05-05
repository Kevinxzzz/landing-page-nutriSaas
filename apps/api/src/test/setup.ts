import { vi } from "vitest";

vi.mock("@/shared/providers/prisma", async () => {
  const actual = await vi.importActual<
    typeof import("@/shared/providers/__mocks__/prisma")
  >("@/shared/providers/__mocks__/prisma");
  return {
    ...actual,
  };
});
