"use client"

import { useState } from "react"
import { Shuffle, ArrowRight, Check, X } from "lucide-react"

export function MnemonicPractice({ mnemonics }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [mode, setMode] = useState("value") // "value" or "mnemonic"
  const [selectedCategory, setSelectedCategory] = useState("")

  // カテゴリの一覧を取得
  const categories = [...new Set(mnemonics.map((m) => m.category).filter(Boolean))]

  // カテゴリでフィルタリングされたmnemonics
  const filteredMnemonics = selectedCategory ? mnemonics.filter((m) => m.category === selectedCategory) : mnemonics

  // 問題がない場合
  if (filteredMnemonics.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-white shadow-sm">
        <p>練習する語呂合わせがありません。</p>
        <p className="text-gray-600 mt-2">「新規追加」タブから追加してください。</p>
      </div>
    )
  }

  const currentMnemonic = filteredMnemonics[currentIndex]

  const checkAnswer = () => {
    const isCorrect =
      mode === "value"
        ? userAnswer.trim() === currentMnemonic.value.trim()
        : userAnswer.trim() === currentMnemonic.mnemonic.trim()

    if (isCorrect) {
      setScore(score + 1)
    }

    setAttempted(attempted + 1)
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    setCurrentIndex((currentIndex + 1) % filteredMnemonics.length)
    setShowAnswer(false)
    setUserAnswer("")
  }

  const shuffleQuestions = () => {
    setCurrentIndex(Math.floor(Math.random() * filteredMnemonics.length))
    setShowAnswer(false)
    setUserAnswer("")
  }

  const toggleMode = () => {
    setMode(mode === "value" ? "mnemonic" : "value")
    setShowAnswer(false)
    setUserAnswer("")
  }

  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-sm text-gray-600">
            問題 {currentIndex + 1} / {filteredMnemonics.length}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${accuracy}%` }}></div>
            </div>
            <span className="text-sm">{accuracy}%</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* カテゴリ選択 */}
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentIndex(0)
              setShowAnswer(false)
              setUserAnswer("")
            }}
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={toggleMode}
          >
            {mode === "value" ? "語呂合わせを答える" : "値を答える"}
          </button>

          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            onClick={shuffleQuestions}
          >
            <Shuffle className="h-3 w-3 mr-1" />
            シャッフル
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold">{currentMnemonic.target}</h2>
          <p className="text-sm text-gray-600">
            {mode === "value" ? "この項目の実際の値を答えてください" : "この項目の語呂合わせを答えてください"}
          </p>
          {currentMnemonic.category && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {currentMnemonic.category}
            </span>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="font-medium mb-1">{mode === "value" ? "語呂合わせ:" : "実際の値:"}</p>
            <p>{mode === "value" ? currentMnemonic.mnemonic : currentMnemonic.value}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="answer" className="block font-medium text-gray-700">
              {mode === "value" ? "実際の値は？" : "語呂合わせは？"}
            </label>
            <input
              type="text"
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="答えを入力してください"
              disabled={showAnswer}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {showAnswer && (
            <div
              className={`p-4 rounded-md ${
                mode === "value"
                  ? userAnswer.trim() === currentMnemonic.value.trim()
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  : userAnswer.trim() === currentMnemonic.mnemonic.trim()
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {mode === "value" ? (
                  userAnswer.trim() === currentMnemonic.value.trim() ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )
                ) : userAnswer.trim() === currentMnemonic.mnemonic.trim() ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
                正解: {mode === "value" ? currentMnemonic.value : currentMnemonic.mnemonic}
              </div>
              {currentMnemonic.description && <p className="mt-2 text-sm">{currentMnemonic.description}</p>}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          {!showAnswer ? (
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={checkAnswer}
            >
              答え合わせ
            </button>
          ) : (
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              onClick={nextQuestion}
            >
              次の問題 <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
