interface SwitchCaseProps<T extends string | number | symbol> {
  value: T
  caseBy: Record<T, React.ReactNode>
  defaultComponent?: React.ReactNode
}

export function SwitchCase<T extends string | number | symbol>({
  caseBy,
  value,
  defaultComponent,
}: SwitchCaseProps<T>) {
  return <>{caseBy[value] ?? defaultComponent ?? null}</>
}
