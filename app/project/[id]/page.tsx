"use client"

import { useParams } from 'next/navigation'
import { useState } from 'react'
import BasicModal from '@/app/components/Modal'
import {
  useQuery,
} from '@tanstack/react-query'
import DatePickerComponent from '@/app/components/DatePicker'
import axios from 'axios'
import { useWriteContract, useAccount } from "wagmi";
import { BASE_URL, GigBlocksAbi, WALLET_ADDRESS } from '@/app/config';
import { Button, TextField, OutlinedInput, InputAdornment } from '@mui/material'
import moment from 'moment'

function useProject(id: string) {
  return useQuery({
    queryKey: ['projectDetail'],
    queryFn: async () => {
      const response = await axios.get(BASE_URL + '/jobs/' + id)
      return response.data
    },
  })
}

function useProfile(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get(BASE_URL + '/profiles/' + walletAddress)
      return response.data
    },
  })
}


export default function ProjectDetail() {
  const account = useAccount()
  const { data: profileData } = useProfile(account.address)
  console.log(profileData, 'profile')
  const params = useParams<{ id: string }>()
  const [open, setOpen] = useState<boolean>(false)
  const [form, setForm] = useState({
    bidAmmount: '',
    bidTime: 0,
    coverLetter: ''
  })
  const { status, data, error, isFetching } = useProject(params.id)
  const { 
    data: dataWriteContract,
    error: errorWriteContract,
    isPending,
    isSuccess,
    writeContract 
  } = useWriteContract()

  const triggerFunction = async () => {
    const profileDetail = profileData.profileDetail
    const args = [1, profileData.username, profileDetail.email, Number(form.bidAmmount), form.bidTime, form.coverLetter]
    
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
      <BasicModal isOpen={open} handleClose={() => setOpen(false)}>
        <h1 className='mb-4 font-bold'>Apply Project</h1>
        <DatePickerComponent isYearOnly={false} onChange={(val: any) => setForm({ ...form, bidTime: moment(val).valueOf()})} />
        <OutlinedInput
          className='mt-4'
          fullWidth
          id="min"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Min"
          onChange={(e) => setForm({ ...form, bidAmmount: e.target.value})}
        />
        <TextField
          className='mt-4'
          fullWidth
          multiline
          rows={5}
          label="Cover Letter"
          placeholder='ur cover letter'
          onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
        />
        <div onClick={() => triggerFunction()} className='action mt-4 flex justify-end'>
          <Button variant='contained' className='px-4 py-2'>Submit</Button>
        </div>
      </BasicModal>
      <Button variant='outlined' onClick={() => setOpen(true)}>
        Apply Job
      </Button>
    </>
  )
}