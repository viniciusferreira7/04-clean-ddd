import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'

export function makeQuestion(override: Partial<QuestionProps> = {}) {
  const question = Question.create({
    authorId: new UniqueEntityId(),
    title: 'Example question',
    slug: Slug.create('example-question'),
    content: 'Content of question',
    ...override,
  })

  return question
}
