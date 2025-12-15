import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { connectDb } from '@/db/connectDb'
import User from '@/models/User'
import Payment from '@/models/Payment'

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'github') {
               await connectDb()

                const email = user?.email || profile?.email
                if (!email) return false

                const currentUser = await User.findOne({ email }).exec()
                if (!currentUser) {
                    const newUser = new User({
                        email,
                        username: email.split('@')[0]
                    })
                    await newUser.save()

                }
            }
            return true
        }
    },
    async session({ session, user, token }) {
        const dbUser = await User.findOne({ email: session.user.email })
        session.user.name = dbUser.username
        return session
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }