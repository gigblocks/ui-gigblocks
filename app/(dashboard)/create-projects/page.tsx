import Sidebar from "@/app/components/Sidebar"
import CreateProjectSection from "@/app/components/section/CreateProject"

export default function CreateProject() {
  return (
    <>
      <Sidebar>
        <div className="flex-grow p-6 bg-gray-100">
          <h1 className="text-2xl font-bold">Create Project</h1>
          <div className="rounded-md bg-white w-full mt-6">
            <CreateProjectSection />
          </div>
        </div>
      </Sidebar>
    </>
  )
}