import { useRouter } from 'next/router'

export function DependenciesDetailViewer() {
  const router = useRouter()

  return <div>{router.query.id}</div>
}
