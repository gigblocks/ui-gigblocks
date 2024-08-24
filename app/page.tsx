"use client"

import Image from "next/image";
import Header1 from "./components/header/Header1";
import ProjectCard from "./components/card/ProjectCard";
import { Pagination, TextField, Button } from '@mui/material'
import Filter from "./components/Filter";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from "./config";
import { Search } from 'lucide-react';

function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get(BASE_URL+'/jobs')
      return response.data
    },
  })
}

export default function Home() {
  const { status, data, error, isFetching } = useProjects()
  let content = data ? data?.map((item:any,i:number) => (
    <div key={ i } className="w-full">
      <ProjectCard data={item.jobDetails} id={item.id} />
    </div>
  )) : "no data"
  return (
    <>
      <Header1 />
      <section className="pt-[120px] pb-90 px-16">
        <div className="container-fluid">
          <div className="flex">
            <div className="filter w-1/4">
              <Filter />
            </div>
            <div className="body w-3/4 pl-12">
              <form className="search-section flex items-center gap-4 mb-8">
                <TextField 
                  id="search-input" 
                  label="Search projects" 
                  variant="outlined" 
                  placeholder="Enter keywords..." 
                  fullWidth
                  InputProps={{
                    startAdornment: <Search size={20} className="text-gray-400 mr-2" />,
                  }}
                  className="bg-white rounded-lg shadow-md"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'green',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'green',
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Search
                </Button>
              </form>
              <div className="w-full">
                {!data ? null : content}
              </div>
              <div className="flex justify-center">
                <Pagination className="mt-12" count={10} variant="outlined" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
