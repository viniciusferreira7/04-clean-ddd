import { type Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachments-list'
import type { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)
    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
