import { AnswerQuestionUseCase } from './answer-question'
import type { AnswerRepository } from '../repositories/anwer-repository'
import type { Answer } from '../entities/answer'

const fakerAnswerRepository: AnswerRepository = {
  create: async (answer: Answer) => {
    return 
  }
}

test('Create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakerAnswerRepository)

  const answer = await answerQuestion.execute({
    instructorId: '1',
    questionId: '1',
    content: 'New answer'
  })

  expect(answer.content).toEqual('New answer')

})