import { Entity } from '../../core/entities/entity'
import type { UniqueEntityId } from '../../core/entities/value-object/unique-entity-id'

interface AnswerProps {
  content: string,
  authorId: UniqueEntityId,
  questionId: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get content(){
    return this.props.content
  }
}