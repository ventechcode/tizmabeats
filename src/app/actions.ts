"use server";

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
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

export const getCustomers = async () => {
  const customers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      orders: true,
      createdAt: true,
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return customers;
};

export const getOrders = async () => {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      createdAt: true,
      price: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      beat: {
        select: {
          id: true,
          name: true,
          producer: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const getDashboardStats = async () => {
  const totalBeats = await prisma.beat.count();
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      price: true,
    },
  });
  return { totalBeats, totalOrders, totalUsers, totalRevenue };
};

export const getUniqueGenres = async () => {
  const genres = await prisma.beat.findMany({
    select: {
      genre: true,
    },
    where: {
      purchased: false,
    },
    orderBy: {
      genre: "asc",
    },
    distinct: ["genre"],
  });
  return genres.map((beat) => beat.genre);
};

export const getUniqueBpms = async () => {
  const bpms = await prisma.beat.findMany({
    select: {
      bpm: true,
    },
    where: {
      purchased: false,
    },
    orderBy: {
      bpm: "asc",
    },
    distinct: ["bpm"],
  });
  return bpms.map((beat) => beat.bpm);
};
