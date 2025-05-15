"use client"

import { useState } from "react"
import { generateMnemonics } from "../lib/ai-service"

export function MnemonicForm({ onAddMnemonic }) {
  const [formData, setFormData] = useState({
    target: "",
    value: "",
    mnemonic: "",
    description: "",
    category: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMnemonics, setGeneratedMnemonics] = useState<string[]>([])
  const [toast, setToast] = useState({ show: false, title: "", message: "", type: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const showToast = (title, message, type = "success") => {
    setToast({ show: true, title, message, type })
    setTimeout(() => setToast({ show: false, title: "", message: "", type: "" }), 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 簡易バリデーション
    if (!formData.target || !formData.value || !formData.mnemonic) {
      showToast("入力エラー", "必須項目をすべて入力してください", "error")
      return
    }

    onAddMnemonic(formData)

    // フォームをリセット
    setFormData({
      target: "",
      value: "",
      mnemonic: "",
      description: "",
      category: "",
    })
    setGeneratedMnemonics([])

    showToast("追加完了", "新しい語呂合わせが追加されました")
  }

  const handleGenerateMnemonics = async () => {
    if (!formData.target || !formData.value) {
      showToast("入力エラー", "項目と値を入力してください", "error")
      return
    }

    setIsGenerating(true)
    try {
      // AIサービスを呼び出して語呂合わせを生成
      const mnemonics = await generateMnemonics(formData.target, formData.value, formData.category)
      setGeneratedMnemonics(mnemonics)
    } catch (error) {
      console.error("Error generating mnemonics:", error)
      showToast("エラー", "語呂合わせの生成に失敗しました", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  const selectMnemonic = (mnemonic) => {
    setFormData((prev) => ({ ...prev, mnemonic }))
    setGeneratedMnemonics([])
  }

  return (
    <div className="space-y-6">
      {/* トースト通知 */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
            toast.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          <h4 className="font-bold">{toast.title}</h4>
          <p>{toast.message}</p>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold">新しい語呂合わせを追加</h2>
          <p className="text-sm text-gray-600">覚えたい情報と、それを記憶するための語呂合わせを入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category" className="block font-medium text-gray-700">
                カテゴリ
              </label>
              <select
                id="category"
                name="category"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">カテゴリを選択</option>
                <option value="歴史">歴史</option>
                <option value="数学">数学</option>
                <option value="化学">化学</option>
                <option value="物理">物理</option>
                <option value="生物">生物</option>
                <option value="地理">地理</option>
                <option value="英語">英語</option>
                <option value="国語">国語</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="target" className="block font-medium text-gray-700">
                覚えたい項目
              </label>
              <input
                type="text"
                id="target"
                name="target"
                placeholder="例: 円周率、元素記号、歴史年号など"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.target}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="value" className="block font-medium text-gray-700">
                実際の値
              </label>
              <input
                type="text"
                id="value"
                name="value"
                placeholder="例: 3.14159、Au、1192など"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.value}
                onChange={handleChange}
              />
            </div>

            {/* AI生成ボタン */}
            <div className="flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                onClick={handleGenerateMnemonics}
                disabled={isGenerating || !formData.target || !formData.value}
              >
                {isGenerating ? "生成中..." : "AIで語呂合わせを生成"}
              </button>
            </div>

            {/* 生成された語呂合わせの選択肢 */}
            {generatedMnemonics.length > 0 && (
              <div className="mt-4 p-4 border rounded-md bg-purple-50">
                <h3 className="font-bold mb-2">AIが生成した語呂合わせ（クリックして選択）</h3>
                <div className="space-y-2">
                  {generatedMnemonics.map((mnemonic, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded-md bg-white cursor-pointer hover:bg-blue-50"
                      onClick={() => selectMnemonic(mnemonic)}
                    >
                      {mnemonic}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="mnemonic" className="block font-medium text-gray-700">
                語呂合わせ
              </label>
              <input
                type="text"
                id="mnemonic"
                name="mnemonic"
                placeholder="例: いい国作ろう鎌倉幕府"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.mnemonic}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium text-gray-700">
                説明（任意）
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="この語呂合わせの説明や覚え方のコツなど"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
