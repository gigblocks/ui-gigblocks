'use client'

import React from 'react'
import queryString from 'query-string';
import { Button } from '@mui/material';
import { useSearchParams } from 'next/navigation'


export default function page() {

    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const platform = searchParams.get('platform')

    console.log(code)

    const paramsGithub = queryString.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT,
        scope: ['read:user', 'user:email'].join(' '), // space seperated string
        allow_signup: true,
    });

    const linkedinLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}&state=true&scope=profile%20email`

    const githubLoginUrl = `https://github.com/login/oauth/authorize?${paramsGithub}`;

    return (
        <section>
          <div className="main-title text-center">
            <h1 className="title">Profile</h1>
          </div>
          <div className="bg-white rounded-lg mx-auto w-[50%] px-12 py-16 border-black border-1 border">
            <div className="mb-4">
              <h4>Let's connect your social media!</h4>
            </div>

            <div className='flex flex-row gap-3'>
            <Button className='bg-black text-white hover:bg-slate-600' href={githubLoginUrl}>Connect Github</Button>
            <Button className=' bg-blue-500 text-white hover:bg-blue-300' href={linkedinLoginUrl}>Connect Linkedin</Button>
            </div>

          </div>
        </section>
    )
}

