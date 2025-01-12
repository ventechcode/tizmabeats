import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/utils/prisma"; // Ensure this points to your Prisma client
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.producer.findUnique({
          where: { email: credentials.email },
        });

        //const hashedPassword = await bcrypt.hash(credentials.password, 10); // Hashing

        //console.log(hashedPassword);

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password");
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    },
  ],
  session: {
    strategy: "jwt", // Use JWT-based session strategy
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Redirect here for unauthenticated users
  },
};

// Export the handler for the App Router
import NextAuth from "next-auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
