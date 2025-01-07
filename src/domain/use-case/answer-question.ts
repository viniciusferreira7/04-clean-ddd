import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { Answer } from '../entities/answer'
import type { AnswerRepository } from '../repositories/anwer-repository'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase{
  constructor(private answerRepository: AnswerRepository){}

 async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest){
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId), 
      questionId: new UniqueEntityId(questionId)
    })

   await this.answerRepository.create(answer)

    return answer
  }
}