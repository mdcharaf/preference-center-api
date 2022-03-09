import { Request, Response } from 'express'
import _ from 'lodash'
import { ForeignKeyConstraintError } from 'sequelize'
import { IEventRepository } from '../repositories'

export default class EventController {
  private readonly repo: IEventRepository
  private readonly fnUUID: () => string

  constructor (repo: IEventRepository, fnUUID: () => string) {
    if (_.isNil(repo)) {
      throw new Error('Invalid repo argument')
    }

    if (!_.isFunction(fnUUID)) {
      throw new Error('fnUUID is not a function')
    }

    this.repo = repo
    this.fnUUID = fnUUID
  }

  public async create (req: Request, res: Response): Promise<void> {
    const { userId, consentId, enabled } = req.body

    if (_.isNil(userId) || _.isNil(consentId) || _.isNil(enabled)) {
      res.status(400).json({ error: 'Missing body attributes, [userId, consentId, enabled]' })
      return
    }

    if (!['sms_notifications', 'email_notifications'].includes(consentId)) {
      res.status(422).json({ error: 'Invalid consentId value. Consent should be either "sms_notifications" or "email notifications"' })
      return
    }

    try {
      const event = await this.repo.create({
        id: this.fnUUID(),
        consentId,
        userId,
        enabled
      })

      res.status(201).json({ ...event.props() })
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(400).json({ error: 'Invalid user id' })
        return
      }

      res.status(400).json({ error })
    }
  }
}
