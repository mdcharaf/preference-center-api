import { Event, IEvent } from '../models'

export interface IEventRepository {
  create: (event: IEvent) => Promise<Event>
}

export class EventRepository implements IEventRepository {
  public async create (eventInput: IEvent): Promise<Event> {
    const result = await Event.create(eventInput)
    return result
  }
}
