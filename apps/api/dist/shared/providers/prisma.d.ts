import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/client";
declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("../../../prisma/generated/client/runtime/client").DefaultArgs>;
export { prisma };
