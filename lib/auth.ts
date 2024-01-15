import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/lib/db";
import { compare } from "bcrypt";
import { Session } from "~/types";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "sign in",
      credentials: {
        email: {
          label: "email",
          type: "email"
        },
        password: {
          label: "password",
          type: "password"
        }
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials.password) return null;

        const user = await db.user.findFirst({
          where: {
            email: credentials.email
          }
        });

        if (!user) return null;

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    // @ts-ignore
    session: ({ token }) => {
      const newSession: Session = {
        id: token.sub!,
        email: token.email!,
        name: token.name!
      };

      return newSession;
    },
    jwt: ({ token }) => {
      return token;
    }
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out"
  }
};

export const getAuthSession = (): Promise<Session | null> => getServerSession(authOptions);
