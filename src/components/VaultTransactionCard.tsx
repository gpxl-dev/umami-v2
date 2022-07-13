import React from 'react'
import styled from 'styled-components'
import { Field } from 'formik'
import type { ReactNode } from 'react'

type RootComponentProps = {
  children: ReactNode;
  className?: string;
};

type ActionProps = {
  text: string;
  type?: 'submit' | 'button';
  disabled?: boolean;
  onClick?: () => void;
};

type ContentProps = {
  children: ReactNode;
};

type HeaderActionProps = {
  text: string;
  onClick?: () => void;
  active?: boolean;
};

type FormFieldProps = {
  label: ReactNode | string;
  name: string;
  type?: 'text' | 'number';
  action?: () => void;
  actionLabel?: string;
  disabled?: boolean;
};

type WarningProps = {
  text: string;
};

function FormField({
  label,
  disabled = false,
  name,
  type = 'number',
  action,
  actionLabel,
}: FormFieldProps) {
  return (
    <label htmlFor={name} className="flex">
      <div className="relative w-full">
        <Field
          name={name}
          type={type}
          className="bg-transparent border border-gray-500 rounded-md rounded-tr-none rounded-br-none px-4 py-2 w-full appearance-none"
        />
        {action && actionLabel ? (
          <div className="absolute right-0 top-0 bottom-0 flex justify-end items-center px-4">
            <button
              type="button"
              onClick={action}
              className="font-bold text-sm text-umami-pink"
            >
              {actionLabel}
            </button>
          </div>
        ) : null}
      </div>
      <div className="border border-gray-500 rounded-md rounded-tl-none rounded-bl-none flex items-center px-4 font-bold">
        {label}
      </div>
    </label>
  )
}

const HeaderStyles = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
`

function Header({ children }: ContentProps) {
  return (
    <HeaderStyles className="flex rounded-md rounded-bl-none rounded-br-none p-4 bg-black border-b border-gray-500">
      {children}
    </HeaderStyles>
  )
}

function HeaderAction({ active, onClick, text }: HeaderActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`duration-200 flex items-center justify-center font-bold uppercase w-full rounded-md rounded-br-none rounded-bl-none hover:text-umami-yellow ${
        active ? 'text-umami-yellow' : ''
      }`}
    >
      {text}
    </button>
  )
}

function HeaderActionDivider() {
  return <div className="w-1 h-8 bg-gray-500 bg-opacity-80" />
}

function Action({
  text,
  type = 'button',
  disabled = false,
  onClick,
}: ActionProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="bg-umami-pink duration-100 font-bold h-10 mt-4 rounded-md text-white uppercase w-full hover:translate-y-[2px] hover:text-umami-yellow disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

function Warning({ text }: WarningProps) {
  return (
    <div className="bg-yellow-200 border-yellow-800 text-black italic mt-4 rounded-lg p-4 leading-snug text-xs">
      {text}
    </div>
  )
}

function Content({ children }: ContentProps) {
  return <div className="p-4">{children}</div>
}

const RootContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.color};
`

export default function VaultTransactionCard({
  children,
  className,
}: RootComponentProps) {
  return (
    <RootContainer
      className={`border border-umami-pink border-2 rounded-md bg-black ${className}`}
    >
      {children}
    </RootContainer>
  )
}

VaultTransactionCard.Action = Action
VaultTransactionCard.Header = Header
VaultTransactionCard.Content = Content
VaultTransactionCard.Warning = Warning
VaultTransactionCard.HeaderAction = HeaderAction
VaultTransactionCard.HeaderActionDivider = HeaderActionDivider
VaultTransactionCard.FormField = FormField
