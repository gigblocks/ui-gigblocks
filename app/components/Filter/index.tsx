"use client"
import { useState } from "react";

export default function Filter() {
  const [openCat, setOpenCat] = useState<boolean>(false)
  return (
    <div>
      <div className="category cursor-pointer">
        <div className="flex justify-between">
          <div className="pointer" onClick={() => setOpenCat(!openCat)}>Category</div>
          <span>^</span>
        </div>
        {!openCat && (
          <div className="dropdown mt-2 w-full">
            <div className="flex justify-between">
              <span>contoh 1</span>
              <span>(1,938)</span>
            </div>
            <div className="flex justify-between">
              <span>contoh 1</span>
              <span>(1,938)</span>
            </div>
            <div className="flex justify-between">
              <span>contoh 1</span>
              <span>(1,938)</span>
            </div>
            <div className="flex justify-between">
              <span>contoh 1</span>
              <span>(1,938)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}