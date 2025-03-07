import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { FetchQuestionAnswerUseCase } from './fetch-question-answer'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswerUseCase

describe('Fetch question answers', () => {
  beforeEach(async () => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new FetchQuestionAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityId('question-1')

    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId,
      }),
    )

    const { answers } = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })
    expect(answers).toHaveLength(3)
    expect(answers.every((item) => item.questionId === questionId)).toBeTruthy()
  })

  it('should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityId('question-1')

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({
          questionId,
        }),
      )
    }

    const { answers } = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
    })

    expect(answers).toHaveLength(2)

    expect(answers.every((item) => item.questionId === questionId)).toBeTruthy()
  })
})
