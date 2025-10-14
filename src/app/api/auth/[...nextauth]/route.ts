// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import EmailProvider from 'next-auth/providers/email';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const REFERRAL_COOKIE_NAME = 'cdh-referral';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  events: {
    createUser: async (message: any) => {
      /* inicio lógica de asignación de patrocinador */
      
      // 1. Leer la cookie de referido
      const cookieStore = await cookies();
      const referrerSlug = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;

      if (referrerSlug) {
        // 2. Buscar al usuario patrocinador en la BD por su 'name'
        //    (Asumimos que el slug de afiliado es el campo 'name' del usuario)
        const referrer = await prisma.user.findFirst({
          where: { name: referrerSlug },
        });

        if (referrer) {
          // 3. Si se encuentra al patrocinador, actualizar al nuevo usuario
          const newUser = message.user;
          await prisma.user.update({
            where: {
              id: newUser.id,
            },
            data: {
              sponsorId: referrer.id,
            },
          });
          console.log(`[NextAuth] Usuario ${newUser.email} asignado al patrocinador ${referrer.email}`);
        }
      }
      /* fin lógica de asignación de patrocinador */
    },
  },
  callbacks: {
    async session({ session, user }: any) {
      // Añadir ID del usuario a la sesión
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };