"use client"
import { useState } from "react";
import { Checkbox, FormControlLabel, Slider } from "@mui/material";
import { ChevronDown, ChevronRight } from 'lucide-react';

enum JobCategory {
  FullstackDevelopment,
  FrontEndDevelopment,
  BackEndDevelopment,
  SmartContractDevelopment,
  DAppDevelopment,
  UiUxDesign,
  GraphicDesign,
  TokenDesign,
  BlockchainArchitecture,
  ConsensusLayerDevelopment,
  Layer2Solutions
}

export default function Filter() {
  const [openCat, setOpenCat] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);

  const categories = [
    { name: "Fullstack Development", value: JobCategory.FullstackDevelopment },
    { name: "Front-End Development", value: JobCategory.FrontEndDevelopment },
    { name: "Back-End Development", value: JobCategory.BackEndDevelopment },
    { name: "Smart Contract Development", value: JobCategory.SmartContractDevelopment },
    { name: "DApp Development", value: JobCategory.DAppDevelopment },
    { name: "UI/UX Design", value: JobCategory.UiUxDesign },
    { name: "Graphic Design", value: JobCategory.GraphicDesign },
    { name: "Token Design", value: JobCategory.TokenDesign },
    { name: "Blockchain Architecture", value: JobCategory.BlockchainArchitecture },
    { name: "Consensus Layer Development", value: JobCategory.ConsensusLayerDevelopment },
    { name: "Layer 2 Solutions", value: JobCategory.Layer2Solutions },
  ];

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(event.target.value);
    setPriceRange(newPriceRange);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
      <div className="category">
        <div 
          className="flex justify-between items-center cursor-pointer mb-4 text-gray-800" 
          onClick={() => setOpenCat(!openCat)}
        >
          <h3 className="font-bold text-lg">Category</h3>
          {openCat ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        {openCat && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox className="text-green-500" />}
                label={
                  <span className="flex justify-between w-full text-gray-700">
                    {cat.name} 
                    <span className="text-gray-500">({cat.value})</span>
                  </span>
                }
                className="m-0 items-center"
              />
            ))}
          </div>
        )}
      </div>

      <div className="price">
        <div 
          className="flex justify-between items-center cursor-pointer mb-4 text-gray-800" 
          onClick={() => setOpenPrice(!openPrice)}
        >
          <h3 className="font-bold text-lg">Price</h3>
          {openPrice ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        {openPrice && (
          <div className="px-2">
            <Slider
              getAriaLabel={() => 'Price range'}
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={100000}
              valueLabelDisplay="auto"
              className="text-green-500"
            />
            <div className="flex justify-between mt-4">
              <input 
                type="number" 
                value={priceRange[0]} 
                onChange={handleInputChange(0)}
                className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
              <input 
                type="number" 
                value={priceRange[1]} 
                onChange={handleInputChange(1)}
                className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}