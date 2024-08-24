"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import BasicModal from '@/app/components/Modal'
import { useQuery } from '@tanstack/react-query'
import DatePickerComponent from '@/app/components/DatePicker'
import axios from 'axios'
import { useWriteContract, useAccount } from "wagmi"
import { BASE_URL, GigBlocksAbi, GIGBLOCKS_ADDRESS, config } from '@/app/config'
import { Button, TextField, OutlinedInput, InputAdornment } from '@mui/material'
import { waitForTransactionReceipt } from "@wagmi/core";
import moment from 'moment'
import { MapPin, Calendar, Eye, MessageSquare, DollarSign, Clock, ThumbsUp, Languages, BarChart } from 'lucide-react'
import Header1 from '@/app/components/header/Header1'
import Image from 'next/image'
import { Address, parseGwei } from 'viem';
import { toast } from 'react-toastify'

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

// Dummy data for the project
const dummyProjectData = {
  id: '1',
  title: 'Blockchain Developer Needed for DeFi Project',
  location: 'Remote',
  date: '2024-03-15',
  views: 1250,
  sellerType: 'Freelancer',
  projectType: 'Fixed-price',
  projectDuration: '3 months',
  projectLevel: 'Expert',
  languages: 'Solidity, JavaScript',
  englishLevel: 'Fluent',
  description: 'We are seeking an experienced blockchain developer to help build a decentralized finance (DeFi) application. The ideal candidate should have a strong background in Solidity and experience with Ethereum-based projects.',
  minRate: 50,
  maxRate: 100,
  buyerName: 'John Doe',
  buyerCompany: 'DeFi Innovations Inc.',
  buyerLocation: 'San Francisco, CA',
  buyerEmployees: '10-50',
  buyerDepartments: 'Engineering, Product'
}

// Dummy data for the profile
const dummyProfileData = {
  username: 'crypto_dev_123',
  profileDetail: {
    email: 'dev@example.com'
  }
}

export default function ProjectDetail() {
  const account = useAccount()
  const params = useParams<{ id: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const [form, setForm] = useState({
    bidAmmount: '',
    bidTime: 0,
    coverLetter: ''
  })
  const { writeContract, data: writeData, isSuccess } = useWriteContract()
  
  useEffect(() => {
    const notify = async () => {
      await waitForTransactionReceipt(config, {
        hash: writeData as Address
      })
      
    }
    if (writeData) {      
      toast.loading('applying for project...')  
      notify().then(() => {
        toast.dismiss()
        toast.success('Apply job successfully')
      }).catch(err => {
        console.log(err)
        toast.dismiss();
        toast.error("Failed to apply project");
      })
    }
  }, [writeData])

  const {data, isLoading} = useQuery({
    queryKey: ['jobsdetail'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/jobs/${params.id}`)
      return response.data
    },
  })
 
  const { data: ethData } = useGetETH()
  const triggerFunction = () => {
    const profileDetail = dummyProfileData.profileDetail
    const ethPrice = ethData?.USD ?  (Number(form.bidAmmount) / ethData.USD).toFixed(6) : 0;
    const wei = parseGwei(`${ethPrice}`);
    const args = [Number(params.id), dummyProfileData.username, profileDetail.email, wei, form.bidTime, form.coverLetter]
    
    writeContract({
      abi: GigBlocksAbi,
      address: GIGBLOCKS_ADDRESS,
      functionName: 'applyForJob',
      args
    })
    setOpen(false)
  }

  return (
    <>
      <Header1 />
      <main className="container mx-auto px-4 pt-[120px] bg-gray-50">
        {
          data && <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{data.jobDetails.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-6">
                <span className="flex items-center"><MapPin size={18} className="mr-2 text-green-500" /> {data.jobDetails.clientLocation}</span>
                <span className="flex items-center"><Calendar size={18} className="mr-2 text-blue-500" /> {new Date(data.jobDetails.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center"><Eye size={18} className="mr-2 text-purple-500" /> {data.applicantCount} Applicants</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: MessageSquare, title: "Seller Type", value: dummyProjectData.sellerType, color: "text-indigo-500" },
                { icon: DollarSign, title: "Project Type", value: dummyProjectData.projectType, color: "text-green-500" },
                { icon: Clock, title: "Project Duration", value: `${data.jobDetails.estimateDuration} days`, color: "text-blue-500" },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <item.icon size={24} className={`mb-3 ${item.color}`} />
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Description</h2>
              <p className="text-gray-700 leading-relaxed">{data.jobDetails.description}</p>
            </div>

            <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {data.jobDetails.skillsRequired.map((skill : string, index :number) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-8 sticky top-24">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">${data.jobDetails.priceRange.min} - ${data.jobDetails.priceRange.max}</h2>
              <p className="text-sm text-gray-600 mb-6">Price Range</p>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">About Client</h3>
              <div className="w-20 h-16  rounded-full flex items-start justify-center text-white">
                <Image
                  src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${data.jobDetails.detailClient.pictureIPFS}` || '/default-avatar.png'}
                  alt="Client Avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-gray-200 "
                />
                </div>
              <div className="flex items-center mb-6">
                
                
                <div></div>
                <div>
                  <p className="font-semibold text-gray-800">{data.jobDetails.detailClient.username}</p>
                  <p className="text-sm text-gray-600">{data.jobDetails.detailClient.description}</p>
                </div>
              </div>
              {/* <div className="flex items-center text-sm text-yellow-500 mb-6">
                ★★★★★ <span className="text-gray-600 ml-2">4.9 (595 reviews)</span>
              </div> */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Location</p>
                  <p className="text-gray-600">{data.jobDetails.detailClient.country}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Preferences</p>
                  <p className="text-gray-600">{data.jobDetails.detailClient.preference}</p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(true)}
                className="mt-8 w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
              >
                Submit a Proposal
              </button>
            </div>
          </div>
        </div>
        }
      </main>

      <BasicModal isOpen={open} handleClose={() => setOpen(false)} width={500}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Submit a Proposal</h2>
          <form className="space-y-6">
            <TextField
              label="Bid Amount"
              type="number"
              value={form.bidAmmount}
              onChange={(e) => setForm({...form, bidAmmount: e.target.value})}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Estimated Time (in days)"
              type="number"
              value={form.bidTime}
              onChange={(e) => setForm({...form, bidTime: parseInt(e.target.value)})}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end">days</InputAdornment>,
              }}
            />
            <TextField
              label="Cover Letter"
              multiline
              rows={6}
              value={form.coverLetter}
              onChange={(e) => setForm({...form, coverLetter: e.target.value})}
              fullWidth
              variant="outlined"
              placeholder="Describe why you're the best fit for this project..."
            />
            <Button 
              onClick={triggerFunction} 
              variant="contained" 
              color="success" 
              fullWidth
              size="large"
              className="mt-4 py-3 text-lg font-semibold transition-all duration-300 hover:bg-green-700"
            >
              Submit Proposal
            </Button>
          </form>
        </div>
      </BasicModal>
    </>
  )
}