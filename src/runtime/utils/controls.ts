export type ControlType = 'text' | 'boolean' | 'select' | 'object' | 'number'

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

export interface SelectControl<T extends string = string> extends BaseControl<T> {
  type: 'select'
  options: readonly T[]
}

export interface ObjectControl extends BaseControl<Record<string, unknown>> {
  type: 'object'
}

export interface NumberControl extends BaseControl<number> {
  type: 'number'
}

export type Control
  = | TextControl
    | BooleanControl
    | SelectControl
    | ObjectControl
    | NumberControl

export type ControlRuntimeItem<C extends Control> = {
  name: string
  type: C['type']
  value: C['default']
} & (C extends SelectControl ? { options: string[] } : object)

export type ControlsResult<T extends Record<string, Control>> = {
  [K in keyof T]: ControlRuntimeItem<T[K]>
}
