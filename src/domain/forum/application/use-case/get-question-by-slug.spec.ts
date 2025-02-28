import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { GetQuestionUseCase } from './get-question-by-slug'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: GetQuestionUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to get question by slug', async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityId(),
      title: 'New question',
      slug: Slug.create('new-question'),
      content: 'Content of question',
    })

    await inMemoryQuestionRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'new-question',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionRepository.items[0].id).toEqual(question.id)
  })

  it('should not be able to get question with wrong slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'non-slug-question',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
