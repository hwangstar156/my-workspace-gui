import styled from 'styled-components'

interface DependencyHeaderProps {
  left?: React.ReactNode
  title: string
  right?: React.ReactNode
}

export function DependencyHeader({ title, right, left }: DependencyHeaderProps) {
  return (
    <Container>
      {left}
      <Text>{title}</Text>
      {right}
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
