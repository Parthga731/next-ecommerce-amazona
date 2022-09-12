import NextAuth from 'next-auth';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcryptjs from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';

const callBacks: any = {
  async jwt({ token, user }: any) {
    if (user?._id) token._id = user._id;
    if (user?.isAdmin) token.isAdmin = user.isAdmin;
    return token;
  },
  async session({ session, token }: any) {
    if (token?._id) session.user._id = token._id;
    if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
    return session;
  },
};

const session: any = {
  strategy: 'jwt',
};

const credentialsProvider: any = {
  async authorize(credentials: any) {
    await db.connect();
    const user = await User.findOne({
      email: credentials.email,
    });
    await db.disconnect();
    if (user && bcryptjs.compareSync(credentials.password, user.password)) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: 'f',
        isAdmin: user.isAdmin,
      };
    }
    throw new Error('Invalid email or password');
  },
};

export default NextAuth({
  session: session,
  callbacks: callBacks,
  providers: [CredentialsProvider(credentialsProvider)],
});
