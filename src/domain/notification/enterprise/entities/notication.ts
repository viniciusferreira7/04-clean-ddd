import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import type { Optional } from '@/core/types/optional'

interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt: Date
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
