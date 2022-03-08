import { Event } from '../models'

export interface IEventRepository {
  create: ({ consentId, userId, enabled }: Event) => Promise<Event>
}

export class EventRepository implements IEventRepository {
  public async create ({ id, consentId, userId, enabled }: Event): Promise<Event> {
    return await Event.create({ id, consentId, userId, enabled })
  }
}
