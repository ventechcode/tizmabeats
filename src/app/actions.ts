"use server";

import prisma from "@/utils/prisma";
import { s3Client } from "@/utils/s3client";
import {DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
      total: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      beats: {
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
      total: true,
    },
    where: {
      status: "completed",
    },
  });
  return { totalBeats, totalOrders, totalUsers, totalRevenue };
};

export const deleteProduct = async (id: string) => {
  await prisma.beat.delete({
    where: {
      id: id,
    },
  });

  const publicPrefix = `public/${id}/`;
  const privatePrefix = `private/${id}/`;

   // Function to delete all objects under a given prefix
   const deleteFolderObjects = async (prefix: string) => {
    // List objects with the specified prefix
    const listResponse = await s3Client.send(new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    }));

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log(`No objects found under prefix: ${prefix}`);
      return;
    }

    // Prepare list of keys to delete
    const objectsToDelete = listResponse.Contents.map(item => ({ Key: item.Key }));

    // Delete all objects in the list
    await s3Client.send(new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Delete: { Objects: objectsToDelete },
    }));

    console.log(`Deleted objects under prefix: ${prefix}`);
  };

  // Delete objects under both public and private prefixes
  await deleteFolderObjects(publicPrefix);
  await deleteFolderObjects(privatePrefix);
}