import NextAuth from "next-auth";
import { hashPassword } from "@/utils/crypto";
import Credentials from "next-auth/providers/credentials";
import prisma from "./utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        const pwHash = await hashPassword(credentials!.password);

        // logic to verify if the user exists
        user = await prisma.producer.findUnique({
          where: {
            email: credentials!.email,
            password: pwHash,
          },
        });
        
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
