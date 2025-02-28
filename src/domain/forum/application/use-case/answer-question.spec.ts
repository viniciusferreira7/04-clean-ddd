import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'

import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('Create answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository)
  })

  it('should be able to create an answer', async () => {
    const answer = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New answer',
    })

    expect(answer.content).toEqual('New answer')
    expect(inMemoryAnswerRepository.items[0].id).toEqual(answer.id)
  })
})
