"use client"
import { useState, useEffect } from "react"
import { config, GigBlocksAbi, GIGBLOCKS_ADDRESS, BASE_URL } from "@/app/config";
import { useRouter } from "next/navigation";
import { TextField, Autocomplete, InputAdornment, OutlinedInput, InputLabel, FormControl, Button, CircularProgress } from "@mui/material"
import { styled } from '@mui/material/styles';
import { JobCategory } from "@/app/data/jobCategory"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import axios from "axios";
import { toast } from "react-toastify";
import { Address } from "viem";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateProject() {
  const account = useAccount()
  const router = useRouter()
  const { 
    writeContractAsync 
  } = useWriteContract()
  
  const dummyTag = [
    'Figma', 'Adobe-xd', 'CSS', 'HTML', 'Boostrap', 'Solidity', 'Javascript', 'Typescript', 'AWS'
  ]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form, setForm] = useState<any>({
    title: '',
    category: null,
    priceRange: {
      min: '',
      max: ''
    },
    estimateDuration: '',
    skillsRequired: [],
    detail: '',
  })
  const [imgFile, setImgFile] = useState<any>(null)
  const [PDFFile, setPDFFile] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setImgFile(file)
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handlePDFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPDFFile(file)
  };

  const handleRemoveImage = () => {
      setSelectedImage(null);
  };

  const handleRemovePDF = () => {
      setPDFFile(null);
  };

  const triggerCreateJob = async () => {
    try {
      toast.loading("Finishing your mutation...");
      let responseProfile = await axios.get(BASE_URL + '/profiles/' + account.address)
      const profileData = responseProfile.data;
      const formData1 = new FormData();
      const formData2 = new FormData();
      console.log(responseProfile, 'woi')
      formData1.append('file', imgFile)
      formData2.append('file', PDFFile)
      const [jobPicture, proposal] = await Promise.all([
        axios.post(BASE_URL + "/files/uploadFile", formData1),
        axios.post(BASE_URL + "/files/uploadFile", formData2)
      ]);

      let jobPictureIPFS = jobPicture.data.IpfsHash;
      let proposalIPFS = proposal.data.IpfsHash;

      console.log(jobPictureIPFS, 'woi')
      let jobDetails = {
        jobPictureIPFS, //harus bentuk file
        proposalIPFS, //harus bentuk file
        title: form.title,
        category: Number(JobCategory.indexOf(form.category)),
        priceRange: {
          min: Number(form.priceRange.min),
          max: Number(form.priceRange.max),
        },
        estimateDuration: Number(form.estimateDuration), // number as a days
        skillsRequired: form.skillsRequired,
        clientLocation: profileData.profileDetail.country,
        createdAt: Date.now(),
        updatedAt: 0, 
        description: form.detail,
        detailClient: profileData.profileDetail,
        applicants: [],
      };
      let { data } = await axios.post(BASE_URL + "/jobs/uploadIpfs", jobDetails)

      const result = await writeContractAsync({
        address: GIGBLOCKS_ADDRESS,
        abi: GigBlocksAbi,
        functionName: 'createJob',
        args: [data.IpfsHash, [jobDetails.category]],
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.loading("Creating Project...");
        },
        onError: () => {
          toast.dismiss();
          toast.error("Failed to create job");
        },
      })
      await waitForTransactionReceipt(config, {
        hash: result as Address
      })
      toast.dismiss();
      toast.success('Create job successfully')
      setTimeout(() => {
        router.push('/manage-projects')
      }, 4000)
    } catch (err) {
      console.log(err)
      toast.dismiss();
      toast.error("Failed to create job");
    }

  }

  return (
    <section className="p-8">
      <div className="pb-4 border-b border-gray-300 mb-4">
        <h5>Basic Information</h5>
      </div>
      <div className="mb-4">
        <label className="form-label fw500 dark-color">
          Project Title
        </label>
        <TextField
          fullWidth
          onChange={(e) => setForm({ ...form, title: e.target.value})}
          type="text"
          className="form-control block mt-2"
          placeholder="ur project title"
        />
      </div>

      <div className="flex gap-4 w-full mb-4">
        <div className="w-full">
          <label>
            Category
          </label>
          <Autocomplete
            className="mt-2"
            disablePortal
            id="asd"
            options={JobCategory}
            fullWidth
            value={form.category}
            onChange={(e, value) => setForm({ ...form, category: value })}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div className="price-range">
          <label>
            Price Range
          </label>
          <div className="flex mt-2">
            <FormControl fullWidth className="mr-2">
              <InputLabel htmlFor="min">Min</InputLabel>
              <OutlinedInput
                id="min"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Min"
                onChange={(e) => setForm({ ...form, priceRange: {
                  ...form.priceRange, min: e.target.value
                } })}
              />
            </FormControl>
            <FormControl fullWidth className="ml-2">
              <InputLabel htmlFor="max">Max</InputLabel>
              <OutlinedInput
                id="max"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Max"
                onChange={(e) => setForm({ ...form, priceRange: {
                  ...form.priceRange, max: e.target.value
                } })}
              />
            </FormControl>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-4">
        <FormControl fullWidth className="col-span-2">
          <label className="heading-color ff-heading fw500 mb10">
            Estimate Duration
          </label>
          <OutlinedInput
            endAdornment={<InputAdornment position="start">day</InputAdornment>}
            onChange={(e) => setForm({ ...form, estimateDuration: e.target.value })}
            className="mt-2"
          />
        </FormControl>
        <div className="col-span-4">
          <label className="heading-color ff-heading fw500 mb10">
            Required Skills
          </label>
          <Autocomplete
            className="mt-2"
            multiple
            id="tags-standard"
            options={dummyTag}
            onChange={(e, value) => setForm({...form, skillsRequired: value })}
            getOptionLabel={(option:string) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Project Tags"
              />
            )}
          />
        </div>
      </div>
      <div>
        <label className="form-label fw500 dark-color">
          Project Detail
        </label>
        <TextField
          fullWidth
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          type="text"
          multiline
          rows={5}
          className="mt-2"
          placeholder="description"
        />
      </div>
      <div className="flex gap-8">
          {selectedImage ? (
            <div className="relative mt-4">
                <img
                    src={selectedImage}
                    alt="Selected Preview"
                    className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
                <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                >
                    X
                </button>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
            </div>
          )}
          {PDFFile ? (
            <div className="relative flex mt-4">
              {PDFFile.name}
              <button
                  onClick={handleRemovePDF}
                  className="absolute top-2 right-[-24px] bg-red-600 text-white p-1 rounded-full"
              >
                  X
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Proposal
                <VisuallyHiddenInput type="file" accept="application/pdf" onChange={handlePDFChange} />
              </Button>
            </div>
          )}
      </div>
      <Button onClick={() => triggerCreateJob()} variant="contained" className="mt-4 py-4 px-12">
        {isLoading ? <CircularProgress className="w-[20px] h-[20px]" sx={{ color: 'white' }} /> : 'Submit'}
      </Button>
    </section>
  )
}