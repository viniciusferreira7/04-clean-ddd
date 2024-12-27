import { Entity } from '../../core/entities/entity'
import type { UniqueEntityId } from '../../core/entities/value-object/unique-entity-id'
import type { Slug } from './value-object/slug'

interface QuestionProps {
  title: string,
  slug: Slug,
  content: string,
  authorId: UniqueEntityId,
}

export class Question extends Entity<QuestionProps> {
}