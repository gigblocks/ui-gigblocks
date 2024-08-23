"use client"
import { useEffect, useState } from "react";
import WalletButton from "../components/WalletButton"
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Autocomplete, Divider, TextField } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract } from 'wagmi'
import axios from 'axios'
import { config, GigBlocksAbi, WALLET_ADDRESS, BASE_URL } from "../config";
import { JobCategory } from "../data/jobCategory";
import DatePickerComponent from "../components/DatePicker";

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
  const { writeContract, failureReason, isError, isPending, isSuccess } = useWriteContract()
  const { isConnected } = useAccount()
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
  
  const [openEducationForm, setOpenEducationForm] = useState<boolean>(true)
  const [openWorkForm, setOpenWorkForm] = useState<boolean>(true)

  useEffect(() => {
    if (isError) {
      console.log(isError, 'woi err')
    }
    if (isSuccess) {
      router.push('/my-profile')
    }
  }, [isPending, isError, isSuccess])

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
      writeContract({ 
        abi: GigBlocksAbi,
        address: WALLET_ADDRESS,
        functionName: 'register',
        args: flag == 1 ? [data.IpfsHash, enumPreference, true, false] : [data.IpfsHash, enumPreference, false, true]
      })
    } catch (err) {
      console.log(err, 'woi wkwk')
    }
  }

  const handleSubmit = (type: string, data: any) => {
    console.log(type, 'woi')
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

  return (
    <section>
      <div className="main-title text-center">
        <h1 className="title">Register</h1>
      </div>
      <div className="bg-white rounded-lg mx-auto w-[50%] px-12 py-16 border-black border-1 border">
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
            id="combo-box-demo"
            options={['Indonesia', 'United States']}
            fullWidth
            value={form.country}
            onChange={(e, value) => setForm({ ...form, country: value })}
            renderInput={(params) => <TextField {...params} />}
          />
          <label className="form-label">Preference</label>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
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
            options={['CSS', 'HTML', 'JavaScript', 'Web3', 'Backend', 'Frontend']}
            onChange={(e, value) => setForm({...form, skills: value })}
            getOptionLabel={(option) => option}
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
              <label className="form-label">Education</label>
              <hr style={{ marginTop: 2, marginBottom: 12 }} />
              {openEducationForm ?
                <FormComponent handleSubmit={handleSubmit} /> :
                <ListComponent list={form.education} />
              }
              {!openEducationForm && (
                <Divider>
                  <div className="hover-black" onClick={() => setOpenEducationForm(true)} style={{ cursor: 'pointer' }}>
                    Add new education
                  </div>
                </Divider>
              )}
              <label className="form-label mt-4">Work Experience</label>
              <hr style={{ marginTop: 2, marginBottom: 12 }} />
              {openWorkForm ?
                <FormComponent handleSubmit={handleSubmit} type="work" /> :
                <ListComponent list={form.workExperience} />
              }
              {!openWorkForm && (
                <Divider>
                  <div className="hover-black" onClick={() => setOpenWorkForm(true)} style={{ cursor: 'pointer' }}>
                    Add new work experience
                  </div>
                </Divider>
              )}
            </>
          )}
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
        </>}
        <div className="flex justify-center w-full mt-6">
          <Button
            className="w-full"
            type="button"
            disabled={validate()}
            onClick={handleRegister}
            variant="outlined"
          >
            Creat Account <i className="fal fa-arrow-right-long" />
          </Button>
        </div>
      </div>
    </section>
  )
}

const FormComponent = ({ handleSubmit, type = 'education' }: Readonly<any>) => {
  const [eduForm, setEduForm] = useState({
    startDate: 0,
    endDate: 0,
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
        <label className="form-label">Start date - End date</label>
        <div className="flex justify-between">
          <div className="w-full mr-2">
            <DatePickerComponent onChange={(val: any) => setEduForm({...eduForm, startDate: val.year() })} />
          </div>
          <div className="w-full ml-2">
            <DatePickerComponent onChange={(val: any) => setEduForm({...eduForm, endDate: val.year() })} />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label">{type === 'education' ? 'Degree name' : 'Role'}</label>
        <TextField
          onChange={(e) => setEduForm({...eduForm, degreeName: e.target.value})}
          fullWidth sx={{ display: 'block' }}
          placeholder={type === 'education' ? 'Degree name' : 'Role'}
        />
      </div>
      <div className="mb-4">
        <label className="form-label">{type === 'education' ? 'School name' : 'Company name'}</label>
        <TextField
          onChange={(e) => setEduForm({...eduForm, schoolName: e.target.value})}
          fullWidth sx={{ display: 'block' }}
          placeholder={type === 'education' ? 'School name' : 'Company name'}
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
        />
      </div>
      <div className="flex justify-content-end mb-4">
        <Button variant="outlined" onClick={() => handleSubmit(type, eduForm )} disabled={validation()}>
          Submit
        </Button>
      </div>
    </>
  )
}

const ListComponent = ({ list = [], }) => {
  return (
    <div className="educational-quality">
      {list.map((data: any, i) => (
        <div key={i}>
          <div className="wrapper mb40 position-relative">
            <div className="del-edit">
              <div className="d-flex">
                <a className="icon me-2" id="edit">
                  {/* <Tooltip title="Edit" className="ui-tooltip">
                    Edit
                  </Tooltip> */}
                  <span className="flaticon-pencil" />
                </a>
                <a className="icon" id="delete">
                  {/* <Tooltip title="Delete" anchorSelect="#delete" className="ui-tooltip">
                    Delete
                  </Tooltip> */}
                  <span className="flaticon-delete" />
                </a>
              </div>
            </div>
            <span className="tag">{data.startDate} - {data.endDate}</span>
            <h5 className="mt15">{data.degreeName}</h5>
            <h6 className="text-thm">{data.schoolName}</h6>
            <p>
              {data.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}