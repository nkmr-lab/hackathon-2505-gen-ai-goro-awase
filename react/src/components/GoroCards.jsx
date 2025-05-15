import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useLlm } from "../hooks/use-llm";

const LOCAL_STORAGE_KEY = "historicalDates";

export default function GoroCards() {
    const { callLlm, response, loading, error } = useLlm();

    // LLMからのレスポンスを受け取ったら historicalDates に追加
    useEffect(() => {
        if (response) {
            try {
                const newData = JSON.parse(response);
                setHistoricalDates(prev => {
                    const updated = [...prev, newData];
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                    return updated;
                });
            } catch (e) {
                console.error("レスポンスのパースに失敗しました", e);
            }
        }
    }, [response]);

    const defaultData = [
        {
            id: 1,
            year: 476,
            phrase: "死なむローマ",
            event: "西ローマ帝国の滅亡",
            period: "古代",
            description: "ゲルマン人傭兵隊長オドアケルにより西ローマ帝国が滅亡し、古代の終焉とされる。",
            likes: 42,
        },
        {
            id: 2,
            year: 622,
            phrase: "ムハンマド旅に",
            event: "ヒジュラ（聖遷）",
            period: "中世初期",
            description: "ムハンマドがメッカからメディナへ移住。イスラム暦元年とされる重要な出来事。",
            likes: 37,
        },
        {
            id: 3,
            year: 800,
            phrase: "はれれカール",
            event: "カール大帝の戴冠",
            period: "中世",
            description: "ローマ教皇がカール大帝に皇帝の冠を授け、西ヨーロッパのキリスト教世界が再編された。",
            likes: 45,
        },
    ];

    const [historicalDates, setHistoricalDates] = useState([]);

    // 初回マウント時にlocalStorageから取得
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            setHistoricalDates(JSON.parse(stored));
        } else {
            setHistoricalDates(defaultData);
        }
    }, []);

    // 更新のたびに保存
    useEffect(() => {
        if (historicalDates.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(historicalDates));
        }
    }, [historicalDates]);

    const handleLike = (id) => {
        setHistoricalDates(
            historicalDates.map((item) =>
                item.id === id ? { ...item, likes: item.likes + 1 } : item
            )
        );
    };

    function getPeriodColor(year) {
        const colorList = [
            "#8E44AD", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
            "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A",
            "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
            "#F44336", "#E91E63", "#EC407A", "#BA68C8", "#9575CD",
            "#7986CB", "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC",
            "#81C784", "#AED581", "#DCE775", "#FFF176", "#FFD54F",
            "#FFB74D", "#FF8A65", "#FF7043", "#8D6E63", "#BDBDBD",
        ];

        const baseYear = 1;
        const interval = 50;

        const index = Math.floor((parseInt(year, 10) - baseYear) / interval);

        return colorList[index] || "#9E9E9E";
    }

    return (
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>
                歴史年号の語呂合わせ
            </h1>
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>
                世界史の重要な年号を語呂合わせで覚えよう！
            </p>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button
                    onClick={() => {
                        callLlm(`
世界の歴史の年号の語呂合わせを考えてください。ただし、かなりユニークなものを考えるようにしてください。
以下の形式で1つ、新しい語呂合わせデータをJSONで生成してください。

{
  "id": 数字,
  "year": 年号（西暦）,
  "phrase": "語呂合わせ",
  "event": "歴史的出来事",
  "period": "時代区分",
  "description": "出来事の説明",
  "likes": 0
}

内容のみ出力してください（囲い文字や説明文は不要）。
`);
                    }}
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "生成中…" : "語呂合わせを生成"}
                </button>

                <button
                    onClick={() => {
                        setHistoricalDates(defaultData);
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultData)); // localStorageに保存
                    }}
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        backgroundColor: "#FF5722",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginTop: "10px",
                    }}
                >
                    データをリセット
                </button>
            </div>


            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                {error && <p style={{ color: "red" }}>エラー: {error}</p>}
            </div>
            {
                console.log("historicalDates", historicalDates)
            }
            {historicalDates.map((item, index) => (
                <div
                    key={index - 1}
                    style={{
                        border: "1px solid #000",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        borderTop: `4px solid ${getPeriodColor(item.year)}`,
                        backgroundColor: "white",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ padding: "16px", borderBottom: "1px solid #eee" }}>
                        <div style={{ justifyContent: "space-between" }}>
                            <div>
                                <span
                                    style={{
                                        display: "inline-block",
                                        backgroundColor: getPeriodColor(item.year),
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {item.period}
                                </span>
                                <div style={{ marginTop: "8px" }}>
                                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                        {item.year}年
                                    </span>
                                    <span style={{ marginLeft: "10px", fontSize: "1.2rem" }}>
                                        「{item.phrase}」
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleLike(item.id)}
                                style={{
                                    backgroundColor: "#f8f8f8",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    alignSelf: "start",
                                    marginLeft: "10px",
                                }}
                            >
                                <Heart style={{ color: "red" }} />
                            </button>
                        </div>
                        <p style={{ marginTop: "10px", color: "#555" }}>{item.event}</p>
                    </div>

                    <div style={{ padding: "16px" }}>
                        <p>{item.description}</p>
                    </div>

                    <div
                        style={{
                            padding: "16px",
                            borderTop: "1px solid #eee",
                            alignItems: "center",
                        }}
                    >
                        <Heart style={{ color: "red", marginRight: "5px" }} />
                        <span>{item.likes} いいね</span>
                    </div>
                </div>
            ))}
        </main>
    );
}
