import { useEffect, useState } from 'react'

interface NpmrcEditorProps {
  type: 'global' | 'project'
  targetPath?: string
}

export function NpmrcEditor({ type, targetPath }: NpmrcEditorProps) {
  const [npmrc, setNpmrc] = useState<string[]>([])

  useEffect(() => {
    const fetchNpmrc = async () => {
      const result = await window.npmrcAPI.readNpmrc(targetPath)

      console.log(result)

      const content = result.content.split('\n')

      setNpmrc(content)
    }

    if (targetPath) {
      fetchNpmrc()
    }
  }, [targetPath])

  const updateNpmrc = async (newContent: string) => {
    const response = await window.npmrcAPI.writeNpmrc(targetPath, newContent)

    if (!response.success) {
      alert(`저장 실패: ${response.error}`)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = e.target.value

    const newContent = result.split('\n')

    setNpmrc(newContent)
    updateNpmrc(newContent.join('\n')) // 파일 업데이트
  }

  return (
    <div>
      <h1>{type} .npmrc Editor</h1>
      <textarea value={npmrc.join('\n')} onChange={handleTextareaChange} rows={20} cols={80} />
    </div>
  )
}
