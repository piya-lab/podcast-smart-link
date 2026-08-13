import { prisma } from "@/lib/prisma";

// Single-client app: there is exactly one Show row, always.
export async function getShow() {
  return prisma.show.findFirst();
}
