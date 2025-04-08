import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityId('answer-1')

    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId,
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId,
      }),
    )
    await inMemoryAnswerCommentRepository.create(
      makeAnswerComment({
        answerId,
      }),
    )

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toHaveLength(3)
    expect(
      result.value?.answerComments.every((item) => item.answerId === answerId),
    ).toBeTruthy()
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityId('answer-1')

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId,
        }),
      )
    }

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toHaveLength(2)
    expect(
      result.value?.answerComments.every((item) => item.answerId === answerId),
    ).toBeTruthy()
  })
})
