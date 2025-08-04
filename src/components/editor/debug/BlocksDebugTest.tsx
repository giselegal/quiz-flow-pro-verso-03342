import React from "react";
import {
  blockDefinitions,
  getCategories,
  getBlocksByCategory,
} from "../../../config/blockDefinitions";

export const BlocksDebugTest: React.FC = () => {
  const categories = getCategories();

  console.log("BlocksDebugTest - blockDefinitions:", blockDefinitions.length);
  console.log("BlocksDebugTest - categories:", categories);

  return (
    <div className="p-4 bg-red-100 border border-red-300">
      <h3 className="font-bold text-red-800">DEBUG: Blocks Test</h3>
      <p>Total blocks: {blockDefinitions.length}</p>
      <p>Total categories: {categories.length}</p>
      <div className="mt-2">
        <p className="font-medium">Categories:</p>
        <ul className="list-disc list-inside">
          {categories.map((cat: string) => (
            <li key={cat}>
              {cat} ({getBlocksByCategory(cat).length} blocks)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
