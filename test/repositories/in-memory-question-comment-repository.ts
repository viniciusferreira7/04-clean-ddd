import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    return questionComment ?? null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  async delete(question: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
