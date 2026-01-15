export const runtime = "nodejs";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("➡️ AUTHORIZE CALLED");
                console.log("➡️ EMAIL RECEIVED:", credentials?.email);
                console.log("➡️ PASSWORD RECEIVED:", credentials?.password);

                await connectDB();

                const user = await User.findOne({
                    email: credentials.email.toLowerCase(),
                });

                console.log("➡️ USER FOUND:", user ? "YES" : "NO");

                if (!user) {
                    console.log("❌ NO USER FOUND");
                    return null;
                }

                console.log("➡️ STORED HASH:", user.password);

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                console.log("➡️ PASSWORD MATCH:", isValid);

                if (!isValid) {
                    console.log("❌ PASSWORD DOES NOT MATCH");
                    return null;
                }

                console.log("✅ LOGIN SUCCESS");

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: user.permissions,
                };
            }

        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.permissions = user.permissions;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.permissions = token.permissions;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
