import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository'
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

    const { answerComments } = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
    })
    expect(answerComments).toHaveLength(3)
    expect(
      answerComments.every((item) => item.answerId === answerId),
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

    const { answerComments } = await sut.execute({
      answerId: answerId.toString(),
      page: 2,
    })

    expect(answerComments).toHaveLength(2)

    expect(
      answerComments.every((item) => item.answerId === answerId),
    ).toBeTruthy()
  })
})
