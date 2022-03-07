import { Request, Response } from 'express'
import { User } from '../models/User'
import { v4 as uuid } from 'uuid'
import _ from 'lodash'
import * as EmailValidator from 'email-validator'
import { UniqueConstraintError } from 'sequelize'

export default class UserController {
  public create (req: Request, res: Response): void {
    const { email } = req.body

    if (_.isNil(email) || !EmailValidator.validate(email)) {
      res.status(422).json({ error: 'Invalid email address' })
      return
    }

    User.create({
      id: uuid(),
      email
    })
      .then(user => res.status(200).json({ data: user.props() }))
      .catch(err => {
        if (err instanceof UniqueConstraintError) {
          res.status(422).json({ error: 'Email already exists' })
          return
        }

        res.status(400).json({ error: err })
      })
  }
}
