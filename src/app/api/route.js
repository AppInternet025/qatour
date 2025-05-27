import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/utils/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Se ejecuta cuando alguien inicia sesión
    async signIn({ user }) {
      await connectToDatabase();

      // Verificar si ya existe el usuario
      const existingUser = await User.findOne({ email: user.email });

      // Si no existe, lo creamos como "user"
      if (!existingUser) {
        await User.create({
          email: user.email,
          username: user.name,
          image: user.image,
          role: 'user', // <-- Rol obligatorio que tú debes garantizar
        });
      }

      return true; // Permitir inicio
    },

    // Adjunta el rol a la sesión del usuario
    async session({ session }) {
      await connectToDatabase();
      const dbUser = await User.findOne({ email: session.user.email });

      session.user.role = dbUser?.role || 'user'; // Importante para Navbar
      return session;
    },
  },
});

export { handler as GET, handler as POST };
