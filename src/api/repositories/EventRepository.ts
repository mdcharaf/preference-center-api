import { Event } from '../models'
import { v4 as uuid } from 'uuid'

export interface IEventRepository {
  create: ({ consentId, userId, enabled }: Event) => Promise<Event>
}

export class EventRepository implements IEventRepository {
  public async create ({ consentId, userId, enabled }: Event): Promise<Event> {
    return await Event.create({ id: uuid(), consentId, userId, enabled })
  }
}
