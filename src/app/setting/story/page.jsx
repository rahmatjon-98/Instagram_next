import React from "react";
import { ChevronRight } from "lucide-react"; // optional icon library

export default function HideStory() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Скрывать историю и эфиры
      </h2>

      <button className="w-full flex justify-between items-center px-4 py-6 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
        <span className="text-gray-600">
          Скрывать историю и эфиры от...
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
}
