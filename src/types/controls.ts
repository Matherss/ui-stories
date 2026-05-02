export type ControlType = 'text' | 'boolean' | 'select'

export interface BaseControl<T> {
  type: ControlType
  default: T
}

export interface TextControl extends BaseControl<string> {
  type: 'text'
}

export interface BooleanControl extends BaseControl<boolean> {
  type: 'boolean'
}

export interface SelectControl extends BaseControl<string> {
  type: 'select'
  options: string[]
}

export type Control = TextControl | BooleanControl | SelectControl