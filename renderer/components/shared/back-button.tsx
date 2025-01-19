import { LeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

export function BackButton() {
  const router = useRouter()

  const handleClickBackButton = () => {
    router.back()
  }

  return <LeftOutlined onClick={handleClickBackButton} style={{ marginRight: '20px' }} />
}
