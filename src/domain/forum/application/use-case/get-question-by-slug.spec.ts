import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

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
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'example-question',
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
