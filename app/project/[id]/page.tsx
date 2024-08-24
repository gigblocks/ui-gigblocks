"use client"

import { useParams } from 'next/navigation'
import { useState } from 'react'
import BasicModal from '@/app/components/Modal'
import { useQuery } from '@tanstack/react-query'
import DatePickerComponent from '@/app/components/DatePicker'
import axios from 'axios'
import { useWriteContract, useAccount } from "wagmi"
import { BASE_URL, GigBlocksAbi, WALLET_ADDRESS } from '@/app/config'
import { Button, TextField, OutlinedInput, InputAdornment } from '@mui/material'
import moment from 'moment'
import { MapPin, Calendar, Eye, MessageSquare, DollarSign, Clock, ThumbsUp, Languages, BarChart } from 'lucide-react'
import Header1 from '@/app/components/header/Header1'
import { parseGwei } from 'viem';

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
  const { data: ethData } = useGetETH()
  const { writeContract, error } = useWriteContract()
  console.log(error, 'woi')
  const triggerFunction = async () => {
    const profileDetail = dummyProfileData.profileDetail
    const ethPrice = ethData?.USD ?  (Number(form.bidAmmount) / ethData.USD).toFixed(6) : 0;
    const wei = parseGwei(`${ethPrice}`);
    console.log(wei, ethPrice, 'price')
    const args = [Number(params.id), dummyProfileData.username, profileDetail.email, wei, form.bidTime, form.coverLetter]
    
    writeContract({
      abi: GigBlocksAbi,
      address: WALLET_ADDRESS,
      functionName: 'applyForJob',
      args
    })
    setOpen(false)
  }

  return (
    <>
      <Header1 />
      <main className="container mx-auto px-4 pt-[120px] bg-gray-50">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{dummyProjectData.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-6">
                <span className="flex items-center"><MapPin size={18} className="mr-2 text-green-500" /> {dummyProjectData.location}</span>
                <span className="flex items-center"><Calendar size={18} className="mr-2 text-blue-500" /> {dummyProjectData.date}</span>
                <span className="flex items-center"><Eye size={18} className="mr-2 text-purple-500" /> {dummyProjectData.views} Views</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: MessageSquare, title: "Seller Type", value: dummyProjectData.sellerType, color: "text-indigo-500" },
                { icon: DollarSign, title: "Project Type", value: dummyProjectData.projectType, color: "text-green-500" },
                { icon: Clock, title: "Project Duration", value: dummyProjectData.projectDuration, color: "text-blue-500" },
                { icon: ThumbsUp, title: "Project Level", value: dummyProjectData.projectLevel, color: "text-yellow-500" },
                { icon: Languages, title: "Languages", value: dummyProjectData.languages, color: "text-red-500" },
                { icon: BarChart, title: "English Level", value: dummyProjectData.englishLevel, color: "text-purple-500" }
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
              <p className="text-gray-700 leading-relaxed">{dummyProjectData.description}</p>
            </div>

            <div className="bg-white rounded-lg p-8 mb-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {['Solidity', 'JavaScript', 'Smart Contracts', 'DeFi', 'Ethereum', 'Web3.js', 'React'].map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-8 sticky top-24">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">${dummyProjectData.minRate} - ${dummyProjectData.maxRate}</h2>
              <p className="text-sm text-gray-600 mb-6">Hourly Rate</p>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">About Buyer</h3>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white text-xl font-bold">
                  {dummyProjectData.buyerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{dummyProjectData.buyerName}</p>
                  <p className="text-sm text-gray-600">{dummyProjectData.buyerCompany}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-yellow-500 mb-6">
                ★★★★★ <span className="text-gray-600 ml-2">4.9 (595 reviews)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Location</p>
                  <p className="text-gray-600">{dummyProjectData.buyerLocation}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Employees</p>
                  <p className="text-gray-600">{dummyProjectData.buyerEmployees}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Departments</p>
                  <p className="text-gray-600">{dummyProjectData.buyerDepartments}</p>
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