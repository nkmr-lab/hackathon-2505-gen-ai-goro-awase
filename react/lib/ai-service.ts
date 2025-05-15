"use server"

import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateMnemonics(target: string, value: string, category?: string): Promise<string[]> {
  try {
    let prompt = `以下の情報に基づいて、覚えやすい語呂合わせを5つ生成してください。
対象: ${target}
値: ${value}
`

    if (category) {
      prompt += `カテゴリ: ${category}\n`

      // カテゴリ別のヒントを追加
      if (category === "歴史") {
        prompt +=
          "歴史の年号の場合は、数字を音読みや訓読みに変換して語呂合わせを作ってください。例: 1192年 → いい国作ろう鎌倉幕府\n"
      } else if (category === "化学") {
        prompt += "元素記号や化学式の場合は、記号の読み方や形を活かした語呂合わせを作ってください。\n"
      } else if (category === "数学") {
        prompt += "数式や定数の場合は、数字の読み方を活かした語呂合わせを作ってください。\n"
      }
    }

    prompt += `
それぞれの語呂合わせは簡潔で覚えやすく、日本語で作成してください。
語呂合わせのみを出力し、各語呂合わせは改行で区切ってください。説明は不要です。`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたは語呂合わせを生成する専門家です。日本語で覚えやすい語呂合わせを作成してください。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0].message.content || ""

    // 改行で分割して配列に変換
    const mnemonics = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("語呂合わせ") && !line.match(/^\d+[.:]/)) // 番号付きリストの場合は番号を除去

    return mnemonics.slice(0, 5) // 最大5つまで
  } catch (error) {
    console.error("Error generating mnemonics:", error)
    throw new Error("語呂合わせの生成に失敗しました")
  }
}
