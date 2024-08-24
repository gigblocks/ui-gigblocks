'use client'

import React, { useState, useEffect } from 'react'
import queryString from 'query-string';
import { useSearchParams } from 'next/navigation'
import { Star, MapPin, Calendar, Clock, UserCheck, MessageSquare, Github, Linkedin, Twitter, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header1 from '@/app/components/header/Header1'
import SimpleRating from '@/app/components/rating/index'

export default function Page() {
    const [connectedPlatforms, setConnectedPlatforms] = useState({
        github: false,
        linkedin: false,
        twitter: false
    });

    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const platform = searchParams.get('platform')

    useEffect(() => {
        if (code && platform) {
            setConnectedPlatforms(prev => ({ ...prev, [platform]: true }));
        }
    }, [code, platform]);

    console.log(code)

    const paramsGithub = queryString.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT,
        scope: ['read:user', 'user:email'].join(' '),
        allow_signup: true,
    });

    const linkedinLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}&state=true&scope=profile%20email`

    const githubLoginUrl = `https://github.com/login/oauth/authorize?${paramsGithub}`;

    const twitterLoginUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_TWITTER_REDIRECT}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`

    return (
      <>
        <Header1 />
        <main className="container mx-auto px-4 pt-[120px] pb-10">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg mb-8">
              <CardContent className="flex items-center p-6">
                <img src="/api/placeholder/100/100" alt="Profile" className="w-20 h-20 rounded-full mr-6 border-4 border-white shadow-md" />
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800">Leslie Alexander</h2>
                  <p className="text-lg text-gray-600">UI/UX Designer</p>
                  <div className="flex items-center mt-2 text-gray-700">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">4.82 (94 reviews)</span>
                    <MapPin className="w-5 h-5 ml-6 mr-1" />
                    <span className="text-sm">London, UK</span>
                    <Calendar className="w-5 h-5 ml-6 mr-1" />
                    <span className="text-sm">Member since April 1, 2022</span>
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
                { icon: UserCheck, bg: "bg-green-100", color: "text-green-600", value: "98%", label: "Job Success" },
                { icon: MessageSquare, bg: "bg-blue-100", color: "text-blue-600", value: "921", label: "Total Jobs" },
                { icon: MessageSquare, bg: "bg-yellow-100", color: "text-yellow-600", value: "20", label: "In Queue Service" }
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
                      As a passionate UI/UX designer, I bring creativity and user-centric thinking to every project. With a keen eye for detail and a deep understanding of user behavior, I craft intuitive and visually appealing interfaces that enhance user experiences across various digital platforms.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      My approach combines aesthetic design principles with data-driven insights, ensuring that every element serves a purpose and contributes to the overall user journey. I'm dedicated to creating designs that not only look great but also drive engagement and achieve business objectives.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-800">Education</h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">2012 - 2014</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">Bachelor's in Fine Arts</h4>
                      <p className="text-gray-600">Modern College of Design</p>
                      <p className="text-gray-600 mt-2">
                        Specialized in digital design and interactive media, honing skills in visual communication and user-centered design principles.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-800">Experience</h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">2012 - 2014</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">UI/UX Designer</h4>
                      <p className="text-gray-600">Tech Innovations</p>
                      <p className="text-gray-600 mt-2">
                        Specialized in digital design and interactive media, honing skills in visual communication and user-centered design principles.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-800">My Skills</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['Figma', 'Sketch', 'HTML5', 'CSS3', 'JavaScript', 'React', 'User Research', 'Wireframing', 'Prototyping', 'UI Animation', 'Design Systems', 'Accessibility'].map((skill) => (
                        <span key={skill} className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:from-green-200 hover:to-green-300 transition-colors duration-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
              <SimpleRating />
          </div>
        </main>
      </>
    )
}
