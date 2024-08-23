"use client"

import Image from "next/image";
import Header1 from "./components/header/Header1";
import ProjectCard from "./components/card/ProjectCard";
import { Pagination, TextField, Button } from '@mui/material'
import Filter from "./components/Filter";
import {
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from "./config";

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
  console.log(data, 'woi data')
  let content = data ? data?.map((item:any,i:number) => (
    <div key={ i } className="col-md-6 col-xl-12">
      <ProjectCard data={item.jobDetails} id={item.id} />
    </div>
  )) : "no data"
  return (
    <>
      <Header1 />
      <section className="pt-[120px] pb-90 px-16">
        <div className="container">
          <div className="flex">
            <div className="filter w-[25%]">
              <Filter />
            </div>
            <div className="body ml-12">
              <form className="search-section flex gap-2 mb-8">
                <TextField id="standard-basic" label="search" variant="outlined" placeholder="search" fullWidth />
                {/* <TextField id="standard-basic" label="Standard" variant="outlined" /> */}
                <Button variant="outlined" className="px-12">Search</Button>
              </form>
              {!data ? null : content}
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
