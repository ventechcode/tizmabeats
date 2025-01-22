'use server';

import prisma from "@/utils/prisma";

export async function getProducts() {
    const products = await prisma.beat.findMany({
      select: {
        id: true,
        createdAt: true,
        name: true,
        purchased: true,
        producer: {
          select: {
            username: true,
          },
        },
        licenses: {
          select: {
            id: true,
            price: true,
            licenseOption: {
              select: {
                name: true,
              },
            }
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      }
    });
    return products;
  } 