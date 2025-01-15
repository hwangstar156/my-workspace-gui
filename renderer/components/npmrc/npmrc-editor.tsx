import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'

interface NpmrcEditorProps {
  type: 'global' | 'project'
  targetPath?: string
}

export function NpmrcEditor({ type, targetPath }: NpmrcEditorProps) {
  const [npmrc, setNpmrc] = useState<string[]>([])

  useEffect(() => {
    const fetchNpmrc = async () => {
      const result = await window.npmrcAPI.readNpmrc(targetPath)

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

  const handleTextareaChange = (value: string) => {
    const newContent = value.split('\n')

    setNpmrc(newContent)
    updateNpmrc(newContent.join('\n')) // 파일 업데이트
  }

  return (
    <div>
      <MonacoEditor
        value={npmrc.join('\n')}
        height="500px"
        language="ini"
        options={{
          minimap: { enabled: false },
          lineHeight: 28,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
        }}
        onChange={(value) => handleTextareaChange(value)}
      />
      {/* <textarea value={npmrc.join('\n')} onChange={handleTextareaChange} rows={20} cols={80} /> */}
    </div>
  )
}
