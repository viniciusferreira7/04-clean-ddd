import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'

import { FetchRecentQuestionUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: FetchRecentQuestionUseCase

describe('Fetch Recent question', () => {
  beforeEach(async () => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createdAt: new Date(2000, 0, 22),
      }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createdAt: new Date(2000, 0, 18),
      }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createdAt: new Date(2000, 0, 15),
      }),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2000, 0, 22),
      }),
      expect.objectContaining({
        createdAt: new Date(2000, 0, 18),
      }),
      expect.objectContaining({
        createdAt: new Date(2000, 0, 15),
      }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionRepository.create(
        makeQuestion({
          createdAt: new Date(2000, 0, 22 + i),
        }),
      )
    }

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions).toHaveLength(2)

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2000, 0, 23),
      }),
      expect.objectContaining({
        createdAt: new Date(2000, 0, 22),
      }),
    ])
  })
})
