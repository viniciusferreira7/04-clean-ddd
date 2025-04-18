import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { OnAnswerCreated } from './on-answer-created'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should send a notification when an answer is created', () => {
    const _onAnswerCreated = new OnAnswerCreated()

    const answer = makeAnswer()

    inMemoryAnswerRepository.create(answer)
  })
})
