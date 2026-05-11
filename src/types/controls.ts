export type ControlType = 'text' | 'boolean' | 'select' | 'object'

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

export interface ObjectControl extends BaseControl<Record<string, unknown>> {
  type: 'object'
}

export type Control = TextControl | BooleanControl | SelectControl | ObjectControl