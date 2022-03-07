import { Request, Response } from 'express'
import _ from 'lodash'
import { Event } from '../models'
import { v4 as uuid } from 'uuid'
import { ForeignKeyConstraintError } from 'sequelize'

export default class EventController {
  public create (req: Request, res: Response): void {
    const { userId, consentId, enabled } = req.body

    if (_.isNil(userId)) {
      res.status(400).json({ error: 'Missing user id' })
      return
    }

    if (_.isNil(enabled)) {
      res.status(400).json({ error: 'Missing enabled flag' })
      return
    }

    if (!['sms_notifications', 'email_notifications'].includes(consentId)) {
      res.status(400).json({ error: 'Invalid consentId value. Consent should be either "sms_notifications" or "email notifications"' })
      return
    }

    Event.create({
      id: uuid(),
      consentId,
      userId,
      enabled
    })
      .then(event =>
        res.status(201).json({ ...event.props() })
      )
      .catch(error => {
        if (error instanceof ForeignKeyConstraintError) {
          res.status(400).json({ error: 'Invalid user id ' })
          return
        }

        res.status(400).json({ error })
      })
  }
}
