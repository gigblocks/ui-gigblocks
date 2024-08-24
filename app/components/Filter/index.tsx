"use client"
import { useState } from "react";
import { Checkbox, FormControlLabel, Slider } from "@mui/material";

export default function Filter() {
  const [openCat, setOpenCat] = useState(true);
  const [openProjectType, setOpenProjectType] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openSkills, setOpenSkills] = useState(true);

  const categories = [
    { name: "UX Designer", count: 1945 },
    { name: "Web Developers", count: 8136 },
    { name: "Illustrators", count: 917 },
    { name: "Node.js", count: 240 },
    { name: "Project Managers", count: 2460 },
  ];

  return (
    <div className="space-y-6">
      <div className="category">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setOpenCat(!openCat)}>
          <h3 className="font-semibold">Category</h3>
          <span>{openCat ? '▼' : '▶'}</span>
        </div>
        {openCat && (
          <div className="space-y-2">
            {categories.map((cat, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                label={<span className="flex justify-between w-full">{cat.name} <span className="text-gray-500">({cat.count})</span></span>}
              />
            ))}
            <div className="text-blue-500 cursor-pointer">+20 more</div>
          </div>
        )}
      </div>

      <div className="project-type">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setOpenProjectType(!openProjectType)}>
          <h3 className="font-semibold">Project type</h3>
          <span>{openProjectType ? '▼' : '▶'}</span>
        </div>
        {openProjectType && (
          <div className="space-y-2">
            <FormControlLabel control={<Checkbox />} label="Fixed" />
            <FormControlLabel control={<Checkbox />} label="Hourly" />
          </div>
        )}
      </div>

      <div className="price">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setOpenPrice(!openPrice)}>
          <h3 className="font-semibold">Price</h3>
          <span>{openPrice ? '▼' : '▶'}</span>
        </div>
        {openPrice && (
          <div className="px-2">
            <Slider
              getAriaLabel={() => 'Price range'}
              min={0}
              max={100000}
              valueLabelDisplay="auto"
            />
            <div className="flex justify-between">
              <input type="number" placeholder="0" className="w-20 p-1 border rounded" />
              <input type="number" placeholder="100000" className="w-20 p-1 border rounded" />
            </div>
          </div>
        )}
      </div>

      <div className="skills">
        <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setOpenSkills(!openSkills)}>
          <h3 className="font-semibold">Skills</h3>
          <span>{openSkills ? '▼' : '▶'}</span>
        </div>
        {openSkills && (
          <div className="space-y-2">
            <FormControlLabel control={<Checkbox />} label="Adobe Photoshop" />
            <FormControlLabel control={<Checkbox />} label="Figma" />
            <FormControlLabel control={<Checkbox />} label="Sketch" />
            <FormControlLabel control={<Checkbox />} label="Adobe XD" />
            <FormControlLabel control={<Checkbox />} label="Balsamiq" />
          </div>
        )}
      </div>
    </div>
  );
}