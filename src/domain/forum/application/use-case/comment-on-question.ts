import { type Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import type { QuestionCommentRepository } from '../repositories/question-comment-repository'
import type { QuestionRepository } from '../repositories/question-repository'
import type { ResourceNotFoundError } from './erros/resource-not-found-error'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      content,
      questionId: new UniqueEntityId(questionId),
    })

    await this.questionCommentRepository.create(questionComment)

    return right({ questionComment })
  }
}
