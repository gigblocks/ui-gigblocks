"use client"
import { useEffect, useState } from "react";
import WalletButton from "../components/WalletButton"
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Autocomplete, Divider, TextField, Tooltip, IconButton } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Delete as DeleteIcon, Edit as EditIcon} from '@mui/icons-material'
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from "@wagmi/core";
import axios from 'axios'
import { config, GigBlocksAbi, GIGBLOCKS_ADDRESS, BASE_URL } from "../config";
import { JobCategory } from "../data/jobCategory";
import DatePickerComponent from "../components/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import { Address } from 'viem';
import { countryList } from "../data/country";
import { skills } from "../data/skills";

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

export default function Register() {
  const router = useRouter()
  const { writeContractAsync, isError, isPending, isSuccess } = useWriteContract()
  const { isConnected, address } = useAccount()
  const [imgFile, setImgFile] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [flag, setFlag] = useState<number>(0) //0 didnt choose, 1 freelancer, 2 employer
  const [form, setForm] = useState<any>({
    username: '',
    description: '',
    email: '',
    country: '',
    preference: null,
    education: [],
    workExperience: [],
    skills: []
  })
  const [choosedData, setChoosedData] = useState<any>({
    startDate: null,
    endDate: null,
    degreeName: '',
    schoolName: '',
    description: ''
  })
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openEducationForm, setOpenEducationForm] = useState<boolean>(true)
  const [openWorkForm, setOpenWorkForm] = useState<boolean>(true)

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const validate = () => {
    const { username, skills, description, email, country, education, workExperience} = form;
    if (flag == 1) {
      if (username && skills.length && description && email && isConnected && flag && country && education.length && workExperience.length) {
        return false;
      }
    } else {
      if (username && description && email && flag && country) {
        return false;
      }
    }
    return true;
  }

  const handleRegister = async () => {
    try {
      setLoading(true)
      toast.loading("Finishing your mutation...");
      const formData = new FormData()
      formData.append('file', imgFile)
      const { data: pictureData } = await axios.post(BASE_URL + "/files/uploadFile", formData)
      let ProfileIPFS = {
        username: '',
        email: '',
        description: '',
        country: '',
        reputation : [],
        pictureIPFS: pictureData.IpfsHash,
        skills: [],
        education: [],
        workExperience: [],
        review: [],
        profileType: ''  //'freelancer' || 'client'
      }
      ProfileIPFS = {
        ...ProfileIPFS, ...form
      }
      ProfileIPFS.profileType = flag == 1 ? 'freelancer' : 'client'
      const { data } = await axios.post(BASE_URL + '/profiles/uploadIpfs', ProfileIPFS)
      const enumPreference = [JobCategory.indexOf(form.preference)]
      const result = await writeContractAsync({ 
        abi: GigBlocksAbi,
        address: GIGBLOCKS_ADDRESS,
        functionName: 'register',
        args: flag == 1 ? [data.IpfsHash, enumPreference, true, false] : [data.IpfsHash, enumPreference, false, true]
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.loading("Registering...");
        },
        onError: () => {
          toast.dismiss();
          toast.error("Failed to register account");
        },
      })
      await waitForTransactionReceipt(config, {
        hash: result as Address,
        pollingInterval: 10_000
      })
      toast.dismiss()
      toast.success("Register successfully")
      setTimeout(() => {
        router.push('/myprofile')
      }, 1000)
    } catch (err) {
      console.log(err)
      toast.dismiss();
      toast.error("Failed to register account");
      setLoading(false)
    }
  }

  const handleSubmit = (type: string, data: any) => {
    if (type === 'education') {
      setForm({ ...form, education: [...form.education, data ]})
      setOpenEducationForm(false)
    } else {
      const newData = {
        startDate: data.startDate,
        endDate: data.endDate,
        roleName: data.degreeName,
        companyName: data.schoolName,
        description: data.description
      }
      setForm({ ...form, workExperience: [...form.workExperience, newData ]})
      setOpenWorkForm(false)
    }
    setChoosedData({
      startDate: 0,
      endDate: 0,
      degreeName: '',
      schoolName: '',
      description: ''
    })
  }

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

  const handleSubmitClose = (type:string, data:any) => {
    if (type === 'education') {
      setOpenEducationForm(false)
    } else {
      setOpenWorkForm(false)
    }
  }

  const handleEdit = (type:string, data:any) => {
    if (type === 'education') {
      setOpenEducationForm(true)
    } else {
      setOpenWorkForm(true)
    }
    setChoosedData(data)
  }

  const handleDelete = (type:string, index:number) => {
    if (type === 'education') {
      const education = form.education.filter((_:any, i:number) => i !== index)
      setForm({...form, education })
    } else {
      const workExperience = form.workExperience.filter((_:any, i:number) => i !== index)
      setForm({ ...form, workExperience })
    }
  }
  return (
    <section className="bg-green-500 py-12 h-full">
      <div className="main-title text-center pt-8">
        <h1 className="font-bold text-4xl text-white">Register</h1>
      </div>
      <div>
      <div className="bg-white rounded-lg shadow-2xl mx-auto w-[50%] px-12 py-16 border-gray-100 border-1 border my-12">
        <div className="mb-4">
          <h4>Let's create your account!</h4>
        </div>
        <WalletButton registerSession={true} />
        <FormControl className="mb-4 mt-6 flex">
          <FormLabel id="demo-row-radio-buttons-group-label">Become a</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={flag}
            onChange={(e) => setFlag(Number(e.target.value))}
          >
            <FormControlLabel disabled={!isConnected} value={1} control={<Radio />} label="Freelancer" />
            <FormControlLabel disabled={!isConnected} value={2} control={<Radio />} label="Employer" />
          </RadioGroup>
        </FormControl>
        {flag !== 0 && <>
          <div className="mb-4">
            <label className="form-label">
              Username
            </label>
            <TextField
              fullWidth
              onChange={(e) => setForm({ ...form, username: e.target.value})}
              type="text"
              className="form-control block"
              placeholder="username"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <TextField
              onChange={(e) => setForm({ ...form, email: e.target.value})}
              type="email"
              fullWidth
              className="form-control block"
              placeholder="ur@email.com"
            />
          </div>
          <label className="form-label">Country</label>
          <Autocomplete
            disablePortal
            className="mb-4"
            id="combo-box-demo"
            options={countryList}
            fullWidth
            value={form.country}
            onChange={(e, value) => setForm({ ...form, country: value })}
            renderInput={(params) => <TextField {...params} />}
          />
          <label className="form-label">Preference</label>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            className="mb-4"
            options={JobCategory}
            fullWidth
            value={form.preference}
            onChange={(e, value) => setForm({ ...form, preference: value })}
            renderInput={(params) => <TextField {...params} />}
          />
          {flag == 1 && <label className="form-label">Skills</label>}
          {flag == 1 && <Autocomplete
            multiple
            id="skills"
            options={skills}
            onChange={(e, value) => setForm({...form, skills: value })}
            getOptionLabel={(option) => option}
            className="mb-4"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Skills"
              />
            )}
          />}
          <div className="mb-4">
            <label className="form-label">Description</label>
            <TextField
              fullWidth
              multiline
              rows={4}
              onChange={(e) => setForm({ ...form, description: e.target.value})}
              className="form-control block"
              placeholder="Over 15 years in software development and project management..."
            />
          </div>

          {flag == 1 && (
            <>
              <label className="form-label font-semibold mb-2 mt-6 text-xl text-gray-800">Education</label>
              <hr style={{ marginTop: 4, marginBottom: 12 }} />
              {openEducationForm ?
                <FormComponent handleSubmit={handleSubmit} handleClose={handleSubmitClose} data={choosedData} /> :
                <ListComponent list={form.education} handleEdit={handleEdit} handleDelete={handleDelete}/>
              }
              {!openEducationForm && (
                <Divider>
                  <div className="hover:font-semibold" onClick={() => setOpenEducationForm(true)} style={{ cursor: 'pointer' }}>
                    Add new education
                  </div>
                </Divider>
              )}
              <label className="form-label font-semibold mb-2 mt-6 text-xl text-gray-800">Work Experience</label>
              <hr style={{ marginTop: 2, marginBottom: 12 }} />
              {openWorkForm ?
                <FormComponent handleSubmit={handleSubmit} handleClose={handleSubmitClose} data={choosedData} type="work" /> :
                <ListComponent list={form.workExperience} handleEdit={handleEdit} type="work" handleDelete={handleDelete}/>
              }
              {!openWorkForm && (
                <Divider>
                  <div className="hover:font-semibold" onClick={() => setOpenWorkForm(true)} style={{ cursor: 'pointer' }}>
                    Add new work experience
                  </div>
                </Divider>
              )}
            </>
          )}
          {selectedImage ? (
            <div className="relative mt-4 w-fit">
                <img
                    src={selectedImage}
                    alt="Selected Preview"
                    className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
                <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full w-[30px] h-[30px]"
                >
                    X
                </button>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                component="label"
                role={undefined}
                className="bg-green-500 text-white font-medium shadow-lg shadow-green-500/50 hover:shadow-lg hover:bg-green-700 hover:shadow-green-700/50"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
            </div>
          )}
        </>}
        <div className="flex justify-center w-full mt-6">
          <Button
            className="w-full bg-green-500 text-white font-medium shadow-lg shadow-green-500/50 hover:shadow-lg hover:bg-green-700 hover:shadow-green-700/50"
            type="button"
            disabled={validate() || isLoading}
            onClick={handleRegister}
            variant="contained"
          >
            Create Account
          </Button>
        </div>
      </div>
      </div>
    </section>
  )
}

const FormComponent = ({ handleSubmit, type = 'education', handleClose, data }: Readonly<any>) => {
  const [eduForm, setEduForm] = useState(data ? data : {
    startDate: null,
    endDate: null,
    degreeName: '',
    schoolName: '',
    description: ''
  })

  const validation = () => {
    const { startDate, endDate, degreeName, schoolName, description } = eduForm;
    if (startDate && endDate && degreeName && schoolName && description) {
      return false;
    }
    return true;
  }
  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between">
          <div className="w-full mr-2">
            <label className="form-label">Start date</label>
            <DatePickerComponent isYearOnly onChange={(val: any) => setEduForm({...eduForm, startDate: moment(val).year() })} />
          </div>
          <div className="w-full ml-2">
            <label className="form-label">End date</label>
            <DatePickerComponent isYearOnly onChange={(val: any) => setEduForm({...eduForm, endDate: moment(val).year() })} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label">{type === 'education' ? 'Degree name' : 'Role'}</label>
        <TextField
          onChange={(e) => setEduForm({...eduForm, degreeName: e.target.value})}
          fullWidth sx={{ display: 'block' }}
          placeholder={type === 'education' ? 'Degree name' : 'Role'}
          value={eduForm.degreeName}
        />
      </div>
      <div className="mb-4">
        <label className="form-label">{type === 'education' ? 'School name' : 'Company name'}</label>
        <TextField
          onChange={(e) => setEduForm({...eduForm, schoolName: e.target.value})}
          fullWidth sx={{ display: 'block' }}
          placeholder={type === 'education' ? 'School name' : 'Company name'}
          value={eduForm.schoolName}
        />
      </div>
      <div className="mb-4">
        <label className="form-label">Description</label>
        <TextField
          multiline
          onChange={(e) => setEduForm({ ...eduForm, description: e.target.value})}
          rows={4}
          className="form-control block"
          fullWidth
          placeholder={type === 'education' ? 'Education description' : 'Work description'}
          variant="outlined"
          value={eduForm.description}
        />
      </div>
      <div className="flex justify-end mb-4">
        <Button
          className="px-6 py-2 mr-4"
          variant="contained" color="error" onClick={() => handleClose(type)}>
          Cancel
        </Button>
        <Button
          className="px-6 py-2 bg-green-500 text-white font-medium shadow-lg shadow-green-500/50 hover:shadow-lg hover:bg-green-700 hover:shadow-green-700/50"
          variant="contained" color="success" onClick={() => handleSubmit(type, eduForm )} disabled={validation()}>
          Submit {type === 'education' ? 'education' : 'work experience'}
        </Button>
      </div>
    </>
  )
}

const ListComponent = ({ list = [], type = 'education', handleEdit, handleDelete }: Readonly<any>) => {
  return (
    <div className="educational-quality">
      {list.map((data: any, i:number) => (
        <div key={i}>
          <div className="wrapper mb40 position-relative">
            <div className="del-edit">
              <div className="flex">
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(type, data)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(type, i)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <span className="tag">{data.startDate} - {data.endDate}</span>
            <h5 className="mt15">{type === 'education' ? 'Degree name : ' : 'Role : '}{type === 'education' ? data.degreeName : data.roleName}</h5>
            <h6 className="text-thm">{type === 'education' ? 'School name : ' : 'Company name : '}{type === 'education' ? data.schoolName : data.companyName}</h6>
            <p>
              {data.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}