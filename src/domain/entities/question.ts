import { randomUUID } from 'node:crypto'
import type { Slug } from './value-object/slug'

interface QuestionProps {
  title: string,
  slug: Slug,
  content: string,
  authorId: string,
}

export class Question {
  public title: string
  public slug: Slug
  public content: string
  public id: string
  public authorId: string

  constructor(props: QuestionProps, id?: string){
    this.title = props.title
    this.slug = props.slug
    this.content = props.content
    this.authorId = props.authorId
    this.id = id ?? randomUUID()
  }
}