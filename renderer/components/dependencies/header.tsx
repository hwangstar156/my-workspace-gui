import styled from 'styled-components'

interface DependencyHeaderProps {
  title: string
  children?: React.ReactNode
}

export function DependencyHeader({ title, children }: DependencyHeaderProps) {
  return (
    <Container>
      <Text>{title}</Text>
      {children}
    </Container>
  )
}

const Text = styled.h1`
  font-size: 14px;
  font-weight: 700;
`

const Container = styled.div`
  display: flex;
  padding: 15px;
  background-color: #fff;
  align-items: center;
`
