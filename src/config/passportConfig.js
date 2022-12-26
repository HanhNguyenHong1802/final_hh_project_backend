import { UserModel } from '../models'

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const express = require('express')

const app = express()
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

export const passportConnect = async () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
      (profile, done) => {
        if (profile?.id) {
          UserModel.findOne({ googleId: profile?.id }).then(existingUser => {
            done(null, existingUser)
          })
        } else {
          new UserModel({
            googleId: profile.id,
            mail: profile.emails[0].value,
            fullName: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName
            }
          })
            .save()
            .then(user => done(null, user))
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    UserModel.findById(id).then(user => {
      done(null, user)
    })
  })

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  )
  app.get('/auth/google/callback', passport.authenticate('google'))
}
