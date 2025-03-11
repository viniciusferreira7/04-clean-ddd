import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }
}
