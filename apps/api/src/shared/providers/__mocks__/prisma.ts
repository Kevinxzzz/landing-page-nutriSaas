import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
import { prisma } from "../prisma";
import { vi, beforeEach } from "vitest";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

vi.mock("@/shared/providers/prisma", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});
