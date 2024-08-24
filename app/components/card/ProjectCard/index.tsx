import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { MapPin, Clock, Users } from 'lucide-react';

interface PriceRange {
  min: number;
  max: number;
}

interface ProjectData {
  applicantCount?: number;
  jobPictureIPFS?: string;
  title?: string;
  clientLocation?: string;
  description?: string;
  skillsRequired?: string[];
  priceRange?: PriceRange;
  createdAt?: number;
}

interface ProjectCardProps {
  data: ProjectData;
  id: string | number;
}

export default function ProjectCard({ data, id }: ProjectCardProps) {
  const {
    applicantCount,
    jobPictureIPFS,
    title,
    clientLocation,
    description,
    skillsRequired,
    priceRange,
    createdAt
  } = data;

  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown time";

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="flex items-start space-x-6 flex-grow">
          <div className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${jobPictureIPFS}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}` || '/default-avatar.png'}
              alt="Client Avatar"
              width={160}
              height={160}
              className="border-4 border-gray-200"
            />
            <div className="absolute bottom-0 -right-1 bg-green-500 rounded-full p-1">
              <div className="bg-white rounded-full p-1">
                <div className="bg-green-500 rounded-full w-3 h-3"></div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-3 text-gray-800">{title}</h3>
            <div className="flex flex-wrap text-sm text-gray-600 mb-4 space-x-6">
              <span className="flex items-center"><MapPin className="mr-2 text-red-500" size={16} />{clientLocation}</span>
              <span className="flex items-center"><Clock className="mr-2 text-blue-500" size={16} />{timeAgo}</span>
              <span className="flex items-center"><Users className="mr-2 text-purple-500" size={16} />{applicantCount ? `${applicantCount} applicants` : 'No applicants yet'}</span>
            </div>
            <p className="text-base text-gray-700 mb-5 leading-relaxed">
              {description || "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text."}
            </p>
            <div className="flex flex-wrap gap-2">
              {skillsRequired && skillsRequired.length > 0 ? (
                skillsRequired.map((skill, index) => (
                  <span key={index} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No skills specified</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right mt-6 md:mt-0 ml-0 md:ml-6 flex flex-col items-end min-w-[150px]">
          <h4 className="font-bold text-2xl text-green-600 mb-2">
            ${priceRange?.min} - ${priceRange?.max}
          </h4>
          <p className="text-sm text-gray-500 mb-6">Price Range</p>
          <Link href={`/project/${id}`} className="w-full">
            <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              View More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}