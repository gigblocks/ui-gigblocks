'use client'

import React, { useState, useEffect } from 'react'
import queryString from 'query-string';
import { useSearchParams, useRouter } from 'next/navigation'
import { Star, MapPin, Calendar, Clock, UserCheck, MessageSquare, Github, Linkedin, Twitter, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header1 from '@/app/components/header/Header1'
import SimpleRating from '@/app/components/rating/index'
import { useAccount, useReadContract } from 'wagmi'
import { GigBlocksAbi, GIGBLOCKS_ADDRESS } from '@/app/config'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from '@/app/config'

function useProfile(address: string) {
  return useQuery({
    queryKey: ['profile', address],
    queryFn: async () => {
      if (!address) return null
      const response = await axios.get(`${BASE_URL}/profiles/${address}`)
      return response.data
    },
    enabled: !!address
  })
}

export default function Page() {
    const [connectedPlatforms, setConnectedPlatforms] = useState({
        github: false,
        linkedin: false,
        twitter: false
    });

    const { address, isConnected } = useAccount()
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const platform = searchParams.get('platform')

    const result = useReadContract({
        abi: GigBlocksAbi,
        address: GIGBLOCKS_ADDRESS,
        functionName: 'isRegistered',
        args: [address]
    })

    const { data: profileData } = useProfile(address as string)

    useEffect(() => {
        if (!isConnected) {
            router.push('/')
        } else if (isConnected && result.data === false) {
            router.push('/')
        }
    }, [isConnected, result.data, router])

    useEffect(() => {
        if (code && platform) {
            setConnectedPlatforms(prev => ({ ...prev, [platform]: true }));
        }
    }, [code, platform]);

    const paramsGithub = queryString.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT,
        scope: ['read:user', 'user:email'].join(' '),
        allow_signup: true,
    });

    const linkedinLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}&state=true&scope=profile%20email`

    const githubLoginUrl = `https://github.com/login/oauth/authorize?${paramsGithub}`;

    const twitterLoginUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_TWITTER_REDIRECT}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`

    if (!isConnected || result.data === false) {
        return null;
    }

    const profileDetail = profileData?.profileDetail || {};
    const registrationDate = profileData?.registrationDate ? new Date(profileData.registrationDate * 1000) : null;

    return (
      <>
        <Header1 />
        <main className="container mx-auto px-4 pt-[120px] pb-10">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg mb-8">
              <CardContent className="flex items-center p-6">
                <img src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${profileDetail.pictureIPFS}`} alt="Profile" className="w-20 h-20 rounded-full mr-6 border-4 border-white shadow-md" />
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800">{profileDetail.username}</h2>
                  <p className="text-lg text-gray-600">{profileDetail.preference}</p>
                  <div className="flex items-center mt-2 text-gray-700">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{profileData?.totalRating || 0} ({profileData?.ratingCount || 0} reviews)</span>
                    <MapPin className="w-5 h-5 ml-6 mr-1" />
                    <span className="text-sm">{profileDetail.country}</span>
                    <Calendar className="w-5 h-5 ml-6 mr-1" />
                    <span className="text-sm">Member since {registrationDate ? registrationDate.toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => !connectedPlatforms.github && (window.location.href = githubLoginUrl)} 
                    className={`${connectedPlatforms.github ? 'opacity-70 cursor-not-allowed' : ''} bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-300`}
                    disabled={connectedPlatforms.github}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    {connectedPlatforms.github ? (
                      <span className="relative">
                        GitHub
                        <Check className="w-4 h-4 absolute -top-2 -right-4 text-green-500" />
                      </span>
                    ) : 'GitHub'}
                  </Button>
                  <Button 
                    onClick={() => !connectedPlatforms.linkedin && (window.location.href = linkedinLoginUrl)} 
                    className={`${connectedPlatforms.linkedin ? 'opacity-70 cursor-not-allowed' : ''} bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-300`}
                    disabled={connectedPlatforms.linkedin}
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    {connectedPlatforms.linkedin ? (
                      <span className="relative">
                        LinkedIn
                        <Check className="w-4 h-4 absolute -top-2 -right-4 text-green-500" />
                      </span>
                    ) : 'LinkedIn'}
                  </Button>
                  <Button 
                    onClick={() => !connectedPlatforms.twitter && (window.location.href = twitterLoginUrl)} 
                    className={`${connectedPlatforms.twitter ? 'opacity-70 cursor-not-allowed' : ''} bg-sky-500 hover:bg-sky-400 text-white transition-colors duration-300`}
                    disabled={connectedPlatforms.twitter}
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    {connectedPlatforms.twitter ? (
                      <span className="relative">
                        Twitter
                        <Check className="w-4 h-4 absolute -top-2 -right-4 text-green-500" />
                      </span>
                    ) : 'Twitter'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: UserCheck, bg: "bg-green-100", color: "text-green-600", value: `${profileData?.totalRating || 0}%`, label: "Job Success" },
                { icon: MessageSquare, bg: "bg-blue-100", color: "text-blue-600", value: profileData?.ratingCount || 0, label: "Total Jobs" },
                { icon: MessageSquare, bg: "bg-yellow-100", color: "text-yellow-600", value: "N/A", label: "In Queue Service" }
              ].map((item, index) => (
                <Card key={index} className="transform hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-full ${item.bg} p-3`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <span className="text-3xl font-bold text-gray-800">{item.value}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-3">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-800">Description</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {profileDetail.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>

                {profileDetail.flags === 3 && (
                  <>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <h3 className="text-xl font-bold text-gray-800">Education</h3>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {profileDetail.education && profileDetail.education.length > 0 ? (
                          profileDetail.education.map((edu: { startDate: string; endDate: string; degreeName: string; schoolName: string; description: string }, index: number) => (
                            <div key={index}>
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">{edu.startDate} - {edu.endDate}</span>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">{edu.degreeName}</h4>
                              <p className="text-gray-600">{edu.schoolName}</p>
                              <p className="text-gray-600 mt-2">{edu.description}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">No education information available.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <h3 className="text-xl font-bold text-gray-800">Experience</h3>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {profileDetail.workExperience && profileDetail.workExperience.length > 0 ? (
                          profileDetail.workExperience.map((exp: { startDate: string; endDate: string; roleName: string; companyName: string; description: string }, index: number) => (
                            <div key={index}>
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">{exp.roleName}</h4>
                              <p className="text-gray-600">{exp.companyName}</p>
                              <p className="text-gray-600 mt-2">{exp.description}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">No work experience information available.</p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {profileDetail.flags === 3 && (
                <div>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <h3 className="text-xl font-bold text-gray-800">My Skills</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profileDetail.skills && profileDetail.skills.length > 0 ? (
                          profileDetail.skills.map((skill: string, index: number) => (
                            <span key={index} className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:from-green-200 hover:to-green-300 transition-colors duration-300">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-600">No skills listed.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
              <SimpleRating />
          </div>
        </main>
      </>
    )
}
