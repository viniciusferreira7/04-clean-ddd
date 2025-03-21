import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { Slug } from '../../enterprise/entities/value-object/slug'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
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

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value?.question.id).toBeTruthy()
      expect(inMemoryQuestionRepository.items[0]).toEqual(
        result.value?.question,
      )
    }
  })

  it('should not be able to get question with wrong slug', async () => {
    const result = await sut.execute({
      slug: 'non-slug-question',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
