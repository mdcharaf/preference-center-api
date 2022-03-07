import { Request, Response } from 'express'
import { User } from '../models/User'
import { v4 as uuid } from 'uuid'
import _ from 'lodash'
import * as EmailValidator from 'email-validator'
import { UniqueConstraintError } from 'sequelize'
import { Event } from '../models'

export default class UserController {
  public getOne (req: Request, res: Response): void {
    const { id } = req.params

    if (_.isNil(id)) {
      res.status(422).json({ error: 'Invalid user id' })
      return
    }

    User.findByPk(id, {
      include: Event,
      order: [
        // Try to figure out how to order stuff explicitly
        // [User, Event, 'createdAt', 'ASC']
      ]
    })
      .then(user => {
        if (_.isNil(user)) {
          res.status(404).json({ error: 'User doesn not exists ' })
          return
        }

        res.status(200).json({
          user: {
            id: user.props().id
          },
          consents: user.props().events?.map(event => ({
            id: event.consentId,
            enabled: event.enabled
          }))
        })
      })
      .catch((error) => res.status(400).json({ error }))
  }

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
      .then(user => res.status(201).json({ ...user?.props() }))
      .catch(err => {
        if (err instanceof UniqueConstraintError) {
          res.status(422).json({ error: 'Email already exists' })
          return
        }

        res.status(400).json({ error: err })
      })
  }

  public delete (req: Request, res: Response): void {
    const { id } = req.params

    if (_.isNil(id)) {
      res.status(422).json({ error: 'Invalid user id' })
      return
    }

    User.destroy({
      where: {
        id: id
      }
    })
      .then(_ => res.status(200).json({ message: 'Successfully deleted' }))
      .catch(error => res.status(400).json({ error }))
  }
}
