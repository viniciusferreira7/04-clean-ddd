import { Entity } from '../../core/entities/entity'
import type { UniqueEntityId } from '../../core/entities/value-object/unique-entity-id'
import type { Slug } from './value-object/slug'

interface QuestionProps {
  authorId: UniqueEntityId,
  bestAnserId: UniqueEntityId,
  title: string,
  slug: Slug,
  content: string,
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
}