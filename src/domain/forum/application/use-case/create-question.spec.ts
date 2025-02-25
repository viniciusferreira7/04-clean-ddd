import type { Question } from '../../enterprise/entities/question'
import type { QuestionRepository } from '../repositories/queston-respository'
import { CreateQuestionUseCase } from './create-question'

const fakerQuestionRepository: QuestionRepository = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  create: async (_question: Question) => {},
}

test('Create an question', async () => {
  const createQuestion = new CreateQuestionUseCase(fakerQuestionRepository)

  const { question } = await createQuestion.execute({
    authorId: '1',
    title: 'New question',
    content: 'Content of question',
  })

  expect(question.id).toBeTruthy()
})
