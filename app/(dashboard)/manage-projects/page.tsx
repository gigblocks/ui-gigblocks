"use client"

import Sidebar from "@/app/components/Sidebar"
import dynamic from 'next/dynamic';

const ManageProjectSection = dynamic(() => import('@/app/components/section/ManageProjectSection'), { ssr: false });

export default function ManageProjects() {
  return (
    <>
      <Sidebar>
        <div className="flex-grow p-6 bg-gray-100">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Manage Projects</h1>
                <h3 className="text-base font-normal">View and edit your current projects</h3>
            </div>
          <div className="rounded-md bg-white w-full mt-6">
            <ManageProjectSection />
          </div>
        </div>
      </Sidebar>
    </>
  )
}