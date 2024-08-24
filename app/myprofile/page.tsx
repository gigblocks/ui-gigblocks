"use client";

import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header1 from "@/app/components/header/Header1";
import SimpleRating from "@/app/components/rating/index";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { GigBlocksAbi, GIGBLOCKS_ADDRESS } from "@/app/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/app/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function useProfile(address: string) {
  return useQuery({
    queryKey: ["profile", address],
    queryFn: async () => {
      if (!address) return null;
      const response = await axios.get(`${BASE_URL}/profiles/${address}`);
      return response.data;
    },
    enabled: !!address,
  });
}

function useReputation(address: string) {
  return useQuery({
    queryKey: ["reputation", address],
    queryFn: async () => {
      if (!address) return null;
      const response = await axios.get(`${BASE_URL}/profiles/reputation/${address}`);
      return response.data;
    },
    enabled: !!address,
  });
}

export default function Page() {
  const [canClaimENS, setCanClaimENS] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isClaimingENS, setIsClaimingENS] = useState(false);
  const [isEnsVerified, setIsEnsVerified] = useState(false);
  // const [showENSModal, setShowENSModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsEnsVerified(localStorage.getItem("is_ens_verified") === "true");
    }
  }, []);

  const { address, isConnected } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const platform = searchParams.get("platform");

  const result = useReadContract({
    abi: GigBlocksAbi,
    address: GIGBLOCKS_ADDRESS,
    functionName: "isRegistered",
    args: [address],
  });

  const { data: reputationScore } = useReadContract({
    abi: GigBlocksAbi,
    address: GIGBLOCKS_ADDRESS,
    functionName: "getReputationScore",
    args: [address],
  }) as { data: number };

  const { data: profileData } = useProfile(address as string);
  const { data: reputationData } = useReputation(address as string);

  const { writeContract, error } = useWriteContract();

  const connectedPlatforms = {
    github: !!(reputationData?.socialMediaFlags & 1),
    linkedin: !!(reputationData?.socialMediaFlags & 2),
    twitter: !!(reputationData?.socialMediaFlags & 4),
  };

  useEffect(() => {
    if (error) {
      console.error("Error claiming ENS:", error);
    }
  }, [error]);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    } else if (isConnected && result.data === false) {
      router.push("/");
    }
  }, [isConnected, result.data, router]);

  const paramsGithub = queryString.stringify({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT,
    scope: ["read:user", "user:email"].join(" "),
    allow_signup: true,
  });

  const linkedinLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT}&state=true&scope=profile%20email`;

  const githubLoginUrl = `https://github.com/login/oauth/authorize?${paramsGithub}`;

  const twitterLoginUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_TWITTER_REDIRECT}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`;

  async function connectPlatform(platform: string) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/${platform}`, {
        code: code,
        walletAddress: address
      });
      const { messageHash, signature } = response.data;

      writeContract({
        address: GIGBLOCKS_ADDRESS,
        abi: GigBlocksAbi,
        functionName: 'connectSocialMedia',
        args: [platform, signature],
      });

      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
      router.refresh();
    } catch (error) {
      console.error("Error connecting platform:", error);
      alert("Failed to connect platform. Please try again.");
    }
  }

  useEffect(() => {
    if (platform && code) {
      connectPlatform(platform);
    }
  }, [platform, code]);

  if (!isConnected || result.data === false) {
    return null;
  }

  useEffect(() => {
    const checkClaimCooldown = () => {
      const lastClaimTime = localStorage.getItem("lastENSClaimTime");
      if (lastClaimTime) {
        const timeSinceClaim = Date.now() - parseInt(lastClaimTime);
        const cooldownPeriod = 60000;
        if (timeSinceClaim < cooldownPeriod) {
          setCanClaimENS(false);
          setCountdown(Math.ceil((cooldownPeriod - timeSinceClaim) / 1000));
        } else {
          setCanClaimENS(true);
          setCountdown(0);
        }
      }
    };

    checkClaimCooldown();
    const timer = setInterval(checkClaimCooldown, 1000);

    return () => clearInterval(timer);
  }, []);

  const claimFreeENS = async () => {
    if (!address || !canClaimENS) return;

    setIsClaimingENS(true);
    setCanClaimENS(false);
    localStorage.setItem("lastENSClaimTime", Date.now().toString());
    setCountdown(60);

    try {
      const username = localStorage.getItem("username");
      const response = await axios.post(`${BASE_URL}/ens/createSubEns`, {
        subdomain: username,
        givenSubdomainAddress: address,
      },
      {
        headers: {
          'X-API-Key': 'pqwjyftfxavlqiixowhbaasinmppfnfl',
          'Content-Type': 'application/json'
        }
      }
    );
      if (response.status === 200) {
        setIsEnsVerified(true);
        localStorage.setItem("is_ens_verified", "true");

        const ensName = `${username}.gigblocks.eth`;
      
        window.location.reload();
        alert("ENS claimed successfully! Your new ENS name is " + ensName);
      } else {
        alert("Failed to claim ENS. Please try again later.");
      }
    } catch (error) {
      alert("An error occurred while claiming ENS. Please try again later.");
    } finally {
      setIsClaimingENS(false);
    }
  };

  // const handleClaimENS = async () => {
  //   try {
  //     await writeContract({
  //       address: GIGBLOCKS_ADDRESS,
  //       abi: GigBlocksAbi,
  //       functionName: 'claimENS',
  //       account: address,
  //     });
  //     // Handle success (e.g., show a success message, update UI)
  //   } catch (err) {
  //     console.error("Error claiming ENS:", err);
  //     // Handle error (e.g., show error message to user)
  //   }
  // };

  const profileDetail = profileData?.profileDetail || {};
  const registrationDate = profileData?.registrationDate
    ? new Date(profileData.registrationDate * 1000)
    : null;

  // useEffect(() => {
  //   if (isEnsVerified && reputationData && !reputationData.hasEns) {
  //     setShowENSModal(true);
  //   }
  // }, [isEnsVerified, reputationData]);

//  function ensModal() {
//     return (
//       <Dialog open={showENSModal} onOpenChange={setShowENSModal}>
//         <DialogContent className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-lg shadow-xl">
//           <DialogHeader className="space-y-4">
//             <DialogTitle className="text-3xl font-bold text-indigo-800 text-center">
//               Elevate Your Reputation!
//             </DialogTitle>
//             <DialogDescription className="text-lg text-gray-700 text-center">
//               <p className="mb-4">
//                 Claim your ENS now and watch your reputation soar by up to <span className="font-semibold text-purple-600">50 points</span>!
//               </p>
//               <p className="italic">
//                 Don't let this chance to enhance your profile slip away.
//               </p>
//             </DialogDescription>
//           </DialogHeader>
//           <div className="mt-6 flex justify-center">
//           <Button
//             onClick={handleClaimENS}
//             disabled={isPending}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
//           >
//             {isPending ? 'Claiming...' : 'Claim Your ENS Now'}
//           </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }



  return (
    <>
    {/* {showENSModal && ensModal()} */}
      <Header1 />
      <main className="container mx-auto px-4 pt-[120px] pb-10">
        {reputationScore < 10 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert">
            <p className="font-bold">Attention!</p>
            <p>Your reputation score is below 10. Complete more tasks to increase your score and unlock more features!</p>
          </div>
        )}
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg mb-8">
            <CardContent className="flex items-center p-6">
              <img
                src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${profileDetail.pictureIPFS}`}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-6 border-4 border-white shadow-md"
              />
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800">
                  {profileDetail.username}
                </h2>
                <a
                  href={`https://ens.app/${profileDetail.username}.gigblocks.eth`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-lg text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                >
                  <span className="flex items-center">
                    <img src="/ens.png" alt="ENS" className="w-5 h-5 mr-2" />
                    {profileDetail.username}.gigblocks.eth
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
                <p className="text-lg text-gray-600">
                  {profileDetail.preference}
                </p>
                <div className="flex items-center mt-2 text-gray-700">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">
                    {profileData?.totalRating || 0} (
                    {profileData?.ratingCount || 0} reviews)
                  </span>
                  <MapPin className="w-5 h-5 ml-6 mr-1" />
                  <span className="text-sm">{profileDetail.country}</span>
                  <Calendar className="w-5 h-5 ml-6 mr-1" />
                  <span className="text-sm">
                    Member since{" "}
                    {registrationDate
                      ? registrationDate.toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
              <Button
                  onClick={claimFreeENS}
                  disabled={isClaimingENS || !canClaimENS || isEnsVerified}
                  className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
                >
                  <img src="/ens.png" alt="ENS" className="w-5 h-5 mr-2" />
                  {isEnsVerified
                    ? "ENS Verified"
                    : isClaimingENS
                    ? "Claiming..."
                    : !canClaimENS
                    ? `Wait ${countdown}s`
                    : "Claim ENS"}
                </Button>
                <a href={githubLoginUrl} rel="noopener noreferrer">
                <Button
                  onClick={() => !connectedPlatforms.github && connectPlatform('github')}
                  className={`${
                    connectedPlatforms.github
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  } bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-300`}
                  disabled={connectedPlatforms.github}
                >
                  <Github className="w-5 h-5 mr-2" />
                  {connectedPlatforms.github ? (
                    <span className="relative">
                      GitHub
                      <Check className="w-4 h-4 absolute -top-2 -right-4 text-green-500" />
                    </span>
                  ) : (
                    "GitHub"
                  )}
                </Button>
                </a>
                <a href={linkedinLoginUrl} rel="noopener noreferrer">
                  <Button
                  className={`${
                    connectedPlatforms.linkedin
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  } bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-300`}
                  disabled={connectedPlatforms.linkedin}
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  {connectedPlatforms.linkedin ? (
                    <span className="relative">
                      LinkedIn
                      <Check className="w-4 h-4 absolute -top-2 -right-4 text-green-500" />
                    </span>
                  ) : (
                    "LinkedIn"
                  )}
                </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: UserCheck,
                bg: "bg-green-100",
                color: "text-green-600",
                value: `${reputationScore || 0}%`,
                label: "Total Reputation Score",
              },
              {
                icon: MessageSquare,
                bg: "bg-blue-100",
                color: "text-blue-600",
                value:  reputationData?.completedProjects || 0,
                label: "Completed Projects",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-full ${item.bg} p-3`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-3">
                    {item.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-800">
                    Description
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {profileDetail.description || "No description available."}
                  </p>
                </CardContent>
              </Card>

              {profileData?.flags === 3 && (
                <>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <h3 className="text-xl font-bold text-gray-800">
                        Education
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {profileDetail.education &&
                      profileDetail.education.length > 0 ? (
                        profileDetail.education.map(
                          (
                            edu: {
                              startDate: string;
                              endDate: string;
                              degreeName: string;
                              schoolName: string;
                              description: string;
                            },
                            index: number
                          ) => (
                            <div key={index}>
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                  {edu.startDate} - {edu.endDate}
                                </span>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">
                                {edu.degreeName}
                              </h4>
                              <p className="text-gray-600">{edu.schoolName}</p>
                              <p className="text-gray-600 mt-2">
                                {edu.description}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-600">
                          No education information available.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <h3 className="text-xl font-bold text-gray-800">
                        Experience
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {profileDetail.workExperience &&
                      profileDetail.workExperience.length > 0 ? (
                        profileDetail.workExperience.map(
                          (
                            exp: {
                              startDate: string;
                              endDate: string;
                              roleName: string;
                              companyName: string;
                              description: string;
                            },
                            index: number
                          ) => (
                            <div key={index}>
                              <div className="flex items-center mb-2">
                                <span className="text-sm font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                  {exp.startDate} - {exp.endDate}
                                </span>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">
                                {exp.roleName}
                              </h4>
                              <p className="text-gray-600">{exp.companyName}</p>
                              <p className="text-gray-600 mt-2">
                                {exp.description}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-600">
                          No work experience information available.
                        </p>
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
                    <h3 className="text-xl font-bold text-gray-800">
                      My Skills
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profileDetail.skills &&
                      profileDetail.skills.length > 0 ? (
                        profileDetail.skills.map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:from-green-200 hover:to-green-300 transition-colors duration-300"
                            >
                              {skill}
                            </span>
                          )
                        )
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
  );
}
