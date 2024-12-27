import type { UniqueEntityId } from '../../core/entities/value-object/unique-entity-id'
import { Answer } from '../entities/answer'
import type { AnswerRepository } from '../repositories/anwer-repository'

interface AnswerQuestionUseCaseRequest {
  instructorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
}

export class AnswerQuestionUseCase{
  constructor(private answerRepository: AnswerRepository){}

 async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest){
    const answer = new Answer({
      content,
      authorId: instructorId, 
      questionId
    } )

   await this.answerRepository.create(answer)

    return answer
  }
}