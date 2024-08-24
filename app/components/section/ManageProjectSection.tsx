"use client"

import React, { useEffect, useState } from 'react';
import { MapPin, Clock, FileText, Pencil, Trash, Users, MessageSquare, Check, RefreshCw, Edit, Trash2, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  useQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL, GigBlocksAbi, GIGBLOCKS_ADDRESS } from '@/app/config';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Tooltip, OutlinedInput, InputAdornment } from '@mui/material';
import DatePickerComponent from '../DatePicker';
import moment from 'moment';
import BasicModal from '../Modal';
import { parseEther, parseGwei } from 'viem';
import { writeContract } from 'viem/actions';

function useManageProjects(isClient:any, walletAddress:string | undefined, limit = 10, status = 0, offset = 0) {
  return useQuery({
    queryKey: ['manageProjects'],
    queryFn: async () => {
      if (isClient) {
        const response = await axios.get(BASE_URL+'/jobs/byClient/' + walletAddress + `?limit=${limit}&status=${status}&offset=${offset}`)
        return response.data
      } else {
        const response = await axios.get(BASE_URL+'/jobs/byFreelancer/' + walletAddress + `?limit=${limit}&status=${status}&offset=${offset}`)
        return response.data
      }
    },
  })
}

function useGetETH() {
  return useQuery({
    queryKey: ['getETH'],
    queryFn: async () => {
      const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`)
      return response.data
    },
    staleTime: Infinity
  })
}

const tabs = [
  "Open Projects",
  "Ongoing Projects",
  "Completed Projects",
  "Approved Projects"
];

const getStatusStyle = (status: string): string => {
  const baseStyle = "px-2 py-1 text-xs font-medium rounded-full inline-block text-center";
  return `${baseStyle} bg-blue-100 text-blue-600`;
};

const getApplicationsStyle = (count: string): string => {
  const baseStyle = "px-2 py-1 text-xs font-medium rounded-full inline-block text-center";
  return `${baseStyle} bg-gray-100 text-gray-600`;
};

const IconPlaceholder: React.FC<{ color: string }> = ({ color }) => (
  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl`}>
    {color.charAt(0).toUpperCase()}
  </div>
);

const ApplicantsModal = ({ projectTitle, projectId}: { projectTitle: string, projectId: number }) => {
  const { data: ethData } = useGetETH()
  const [open, setOpen] = useState(false)
  const [isShow, setShow] = useState<string>('')
  const [form, setForm] = useState({
    payableAmmount: '',
    deadline: 0
  })
  const { data } = useReadContract({
    abi: GigBlocksAbi,
    address: GIGBLOCKS_ADDRESS,
    functionName: 'getJobApplicants',
    args: [projectId, 0, 100]
  })
  const applicants:any = data;

  const {
    error,
    isPending, 
    isSuccess,
    writeContract 
  } = useWriteContract()
  console.log(error, 'woi')
  const ethPrice = ethData?.USD ?  (Number(form.payableAmmount) / ethData.USD).toFixed(6) : 0;
  const wei = parseGwei(`${ethPrice}`);
  const eth = parseEther(ethPrice.toString())

  const triggerAssignFreelancer = () => {
    writeContract({
      abi: GigBlocksAbi,
      address: GIGBLOCKS_ADDRESS,
      functionName: 'assignFreelancer',
      args: [projectId, isShow, eth, form.deadline],
      value: eth,
    })
    setOpen(false)
  }

  

  return (
    <>
      <Button variant="outline" size="sm" className="mr-2" onClick={() => setOpen(true)}>
        <Users className="mr-2 h-4 w-4" />
        Applicants
      </Button>
      <BasicModal isOpen={open} handleClose={() => setOpen(false)} width={600}>
        <div className="grid gap-4 py-4">
          {projectTitle}
          {applicants?.length ? applicants?.map((applicant: any, i:number) => (
            <>
              <div key={applicant.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{applicant.freelancerName}</p>
                  <p className="text-sm text-gray-500">{applicant.freelancerEmail}</p>
                </div>
                <div className="flex space-x-2">
                  <Tooltip title="assign freelancer">
                    <Button onClick={() => setShow(applicant.freelancerWalletAddress)} size="sm" variant="outline">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {isShow === applicant.freelancerWalletAddress && (
                <>
                  <div className='border-b border-gray-500 pb-4 items-center'>
                    <div className='flex gap-4'>
                      <OutlinedInput
                        className='w-1/2'
                        placeholder='payable ammount'
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        onChange={(e) => setForm({ ...form, payableAmmount: e.target.value})}
                      />
                      <DatePickerComponent isYearOnly={false} onChange={(val:any) => setForm({ ...form, deadline: moment(val).valueOf() })} />
                    </div>
                    <div className='flex justify-end w-full mt-4'>
                      <Button onClick={() => triggerAssignFreelancer()} className='px-10'>Submit</Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )) : null}
        </div>
      </BasicModal>
    </>
  );
};

export default function ManageProjectSection() {
  const {
    error,
    isPending, 
    isSuccess,
    writeContract 
  } = useWriteContract()

  const [activeTab, setActiveTab] = useState("Open Projects");
  const [status, setStatus] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const account = useAccount()
  const {data: isClient} = useReadContract({ abi: GigBlocksAbi, address: GIGBLOCKS_ADDRESS, functionName: 'isClient', args: [account.address] })
  const { data: projectData, refetch } = useManageProjects(isClient, account.address, 10, status)

  useEffect(() => {
    refetch()
  }, [status, isSuccess])
  console.log(error, 'wkwk')
  const renderActionButtons = (tab: string, project: any) => {
    switch (tab) {
      case "Open Projects":
        return (
          <div className="flex space-x-2">
            <ApplicantsModal projectTitle={project.title} projectId={project.id} />
            <button className="text-blue-600 hover:text-blue-900">
              <Edit size={18} />
            </button>
            <button className="text-red-600 hover:text-red-900">
              <Trash2 size={18} />
            </button>
          </div>
        );
      case "Ongoing Projects":
        return (
          <>
            <Button variant="outline" size="sm">
              <MessageSquare size={14} className="text-blue-600" />
            </Button>
            {!isClient ? <Button variant="outline" size="sm" className='ml-2' onClick={() => {
              writeContract({ abi: GigBlocksAbi, address: GIGBLOCKS_ADDRESS, functionName: 'completeJob', args: [project.id]})
            }}>
              <Check size={14} className="text-green-600" />
            </Button> : null}
          </>
        );
      case "Completed Projects":
        return (
          <div className="flex space-x-2">
            {isClient ? (
              <>
                <Button variant="outline" size="sm" onClick={() => {
                  writeContract({ abi: GigBlocksAbi, address: GIGBLOCKS_ADDRESS, functionName: 'approveJob', args: [project.id]})
                }}>
                  <Check size={14} className="text-green-600" />
                  Approve
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw size={14} className="text-orange-600" />
                  Revision
                </Button>
              </>
            ) : null}
          </div>
        );
      case "Approved Projects":
        return (
          <>
            {isClient == false && !project.isPaid ? <Button variant="outline" size="sm" className='ml-2' onClick={() => {
              writeContract({ abi: GigBlocksAbi, address: GIGBLOCKS_ADDRESS, functionName: 'claimPayment', args: [project.id]})
            }}>
              <Check size={14} className="text-green-600 mr-2" /> Claim Payment
            </Button> : null}
          </>
        )
      default:
        return null;
    }
  };

  const Pagination = () => (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          // onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <section className="p-3">
      <div className="mb-6">
        <nav className="flex space-x-1 border-b border-gray-200">
          {tabs.map((tab,i) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab(tab)
                setStatus(i)
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-gray-50">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "Open Projects" ? "Applications" : "Location"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "Open Projects" ? "Created & Expired" : "Time"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === "Open Projects" ? "Status" : "Category"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projectData?.length ? projectData.map((project:any, index:any) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.jobDetails.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activeTab === "Open Projects" ? (
                    <span className={getApplicationsStyle('applications' in project ? project.applications : '')}>
                      {'applications' in project ? project.applications : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {'location' in project ? project.location : ''}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {'createdExpired' in project ? project.createdExpired : project.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activeTab === "Open Projects" ? (
                    <span className={getStatusStyle('status' in project ? project.status : '')}>
                      {'status' in project ? project.status : ''}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {'category' in project ? project.category : ''}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {renderActionButtons(activeTab, project)}
                </td>
              </tr>
            )) : <>no data</>}
          </tbody>
        </table>
        <Pagination />
      </div>
    </section>
  );
}