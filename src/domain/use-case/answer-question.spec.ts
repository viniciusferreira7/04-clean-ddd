import type { Answer } from '../entities/answer'
import type { AnswerRepository } from '../repositories/anwer-repository'
import { AnswerQuestionUseCase } from './answer-question'

const fakerAnswerRepository: AnswerRepository = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  create: async (_answer: Answer) => {},
}

test('Create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakerAnswerRepository)

  const answer = await answerQuestion.execute({
    instructorId: '1',
    questionId: '1',
    content: 'New answer',
  })

  expect(answer.content).toEqual('New answer')
})
