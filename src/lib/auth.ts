import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./database";
import { deleteProfile } from "./image";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 3,
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false
      }
    },
    deleteUser: {
      enabled: true,
      afterDelete: async (user, ctx) => {
        await deleteProfile(user.image!)
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          return {
            data: {
              ...user,
              image: "default.png"
            }
          }
        }
      },
    }
  }
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user