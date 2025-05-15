"use client"

import { useState } from "react"
import { MnemonicList } from "../components/mnemonic-list"
import { MnemonicForm } from "../components/mnemonic-form"
import { MnemonicPractice } from "../components/mnemonic-practice"

// サンプルデータ
const initialMnemonics = [
  {
    id: 1,
    target: "円周率（π）",
    value: "3.14159265358979",
    mnemonic: "産医師異国に向かい 無理やり言うことにこだわり 苦心の末に",
    description: "各数字の音に対応する言葉を並べた語呂合わせです。3（さん）1（い）4（し）1（い）5（こ）9（く）...",
    category: "数学",
  },
  {
    id: 2,
    target: "元素記号 - 貴金属",
    value: "Au, Ag, Pt",
    mnemonic: "金（Au）銀（Ag）は、プラチナ（Pt）より高い",
    description: "金はAu（ラテン語のAurumから）、銀はAg（ラテン語のArgentumから）、プラチナはPt",
    category: "化学",
  },
  {
    id: 3,
    target: "歴史年号 - 鎌倉幕府",
    value: "1192年",
    mnemonic: "いい国作ろう鎌倉幕府",
    description: "1192を「いい（1）くに（9）つくろう（2）」と読む",
    category: "歴史",
  },
]

export default function Home() {
  const [mnemonics, setMnemonics] = useState(initialMnemonics)
  const [activeTab, setActiveTab] = useState("list")

  const addMnemonic = (newMnemonic) => {
    setMnemonics([
      ...mnemonics,
      {
        id: mnemonics.length + 1,
        ...newMnemonic,
      },
    ])
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">語呂合わせ学習支援システム</h1>
      <p className="text-center mb-8 text-gray-600">
        語呂合わせを作成、保存、練習して、効率的に記憶力を向上させましょう
      </p>

      <div className="w-full max-w-4xl mx-auto">
        {/* カスタムタブ */}
        <div className="flex border-b mb-8">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "list" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("list")}
          >
            語呂合わせ一覧
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "add" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("add")}
          >
            新規追加
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "practice"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("practice")}
          >
            練習モード
          </button>
        </div>

        {/* タブコンテンツ */}
        {activeTab === "list" && <MnemonicList mnemonics={mnemonics} />}
        {activeTab === "add" && <MnemonicForm onAddMnemonic={addMnemonic} />}
        {activeTab === "practice" && <MnemonicPractice mnemonics={mnemonics} />}
      </div>
    </main>
  )
}
