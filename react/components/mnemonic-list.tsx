"use client"

import { useState } from "react"
import { Search } from "lucide-react"

export function MnemonicList({ mnemonics }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMnemonics = mnemonics.filter(
    (mnemonic) =>
      mnemonic.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mnemonic.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mnemonic.mnemonic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mnemonic.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="検索..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMnemonics.length === 0 ? (
        <p className="text-center py-8 text-gray-500">検索結果がありません</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredMnemonics.map((mnemonic) => (
            <div key={mnemonic.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-lg">{mnemonic.target}</h3>
                <p className="text-sm text-gray-600">{mnemonic.value}</p>
                {mnemonic.category && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {mnemonic.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium mb-2">{mnemonic.mnemonic}</p>
                <p className="text-sm text-gray-600">{mnemonic.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
