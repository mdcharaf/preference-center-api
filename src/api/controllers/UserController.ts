import { Request, Response } from 'express'
import _ from 'lodash'
import * as EmailValidator from 'email-validator'
import { UniqueConstraintError } from 'sequelize'
import { IUserRepository } from '../repositories/UserReporistory'

export default class UserController {
  private readonly repo: IUserRepository
  private readonly fnUUID: () => string

  constructor (repo: IUserRepository, fnUUID: () => string) {
    if (_.isNil(repo)) {
      throw new Error('Missing UserRepository')
    }

    if (!_.isFunction(fnUUID)) {
      throw new Error('fnUUID is not a function')
    }

    this.repo = repo
    this.fnUUID = fnUUID
  }

  public async getOne (req: Request, res: Response): Promise<void> {
    const { id } = req.params

    if (_.isNil(id)) {
      res.status(400).json({ error: 'Bad parameters' })
      return
    }

    try {
      const user = await this.repo.get(id)

      if (_.isNil(user) || _.isEmpty(user)) {
        res.status(404).json({ error: 'User doesn not exists ' })
        return
      }

      res.status(200).json({
        user: {
          id: user.props().id,
          email: user.props().email
        },
        consents: user.props().events?.map(event => ({
          id: event.consentId,
          enabled: event.enabled
        }))
      })
    } catch (error) {
      res.status(400).json({ error })
    }
  }

  public async create (req: Request, res: Response): Promise<void> {
    const { email } = req.body

    if (_.isNil(email)) {
      res.status(400).json({ error: 'Missing attributes' })
      return
    }

    if (_.isNil(email) || !EmailValidator.validate(email)) {
      res.status(422).json({ error: 'Invalid email address' })
      return
    }

    try {
      const user = await this.repo.create({ id: this.fnUUID(), email })
      res.status(201).json({ ...user?.props() })
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        res.status(422).json({ error: 'Email already exists' })
        return
      }
      res.status(400).json({ error: err })
    }
  }

  public async delete (req: Request, res: Response): Promise<void> {
    const { id } = req.params
    if (_.isNil(id)) {
      res.status(400).json({ error: 'Bad parameters' })
    }

    try {
      await this.repo.delete(id)
      res.status(200).json({ message: 'successfully deleted' })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}
