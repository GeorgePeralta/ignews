import { query  as q } from 'faunadb'

import NextAuth from 'next-auth'
import GithubProviders from 'next-auth/providers/github'

import { fauna } from '../../../services/fauna'

export default NextAuth({  
  providers: [
    GithubProviders({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,      
    }),    
  ], 
  callbacks: {
    async session({session}) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
              ])
          )
        )
  
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,

        }
      }
    },
    async signIn({ user, account, profile, credentials}) {
      const { email } = user      
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                    q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {data: { email }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                  q.Casefold(user.email)
              )
            )          
          )          
        )        
        return true

      } catch (err){
        console.log(err);
        
        return false

      }        
    },
  },
})