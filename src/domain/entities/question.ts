import dayjs from 'dayjs'
import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { Slug } from './value-object/slug'
import type { Optional } from '@/core/types/optional'

interface QuestionProps {
  authorId: UniqueEntityId,
  bestAnswerId?: UniqueEntityId,
  title: string,
  slug: Slug,
  content: string,
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get authorId(){
    return this.props.authorId
  }

  get bestAnswerId(){
    return this.props.bestAnswerId
  }

  get title(){
    return this.props.title
  }

  get slug(){
    return this.props.slug
  }

  get content(){
    return this.props.content
  }

  get createdAt(){
    return this.props.createdAt
  }

  get updatedAt(){
    return this.props.updatedAt
  }

  get isNew():Boolean {
    return dayjs().diff(this.props.createdAt, 'days') <= 3
  }

  get except(){
    return this.props.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch(){
    this.props.updatedAt = new Date()
  }

  set title(title: string){
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  set content(content: string){
    this.props.content = content

    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined){
    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityId){
    const question = new Question({...props, slug: props.slug ?? Slug.createFromText(props.title), createdAt: new Date()}, id)

    return question
  }
}