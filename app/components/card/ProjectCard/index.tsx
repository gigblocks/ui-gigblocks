import Image from "next/image";
import Link from "next/link";

export default function ProjectCard3({ data, id }: Readonly<{ data: any, id: any }>) {

  return (
    <>
      <div className="rounded-lg bg-white p-[30px]">
        <div className="col-lg-8 ps-0 bdrr1 bdrn-xl">
          <div className="grid grid-cols-12 gap-1">
            <div className="left-section pr-[12px] col-span-9">
              <div className="flex">
                <div className="rounded-full mb-15">
                  <Image
                    height={60}
                    width={60}
                    className="rounded-circle mx-auto"
                    src={data?.img || ''}
                    alt="rounded-circle"
                  />
                </div>
                <div>
                  <h5 className="title mb-3">{data?.title}</h5>
                  <div className="flex detail">
                    <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                      <i className="flaticon-place fz16 vam text-thm2 me-1"></i>
                      {data?.clientLocation}
                    </p>
                    <p  className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                      <i  className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs"></i>{" "}
                      2 hours ago
                    </p>
                    <p  className="mb-0 fz14 list-inline-item mb5-sm">
                      <i  className="flaticon-contract fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs"></i>{" "}
                      1 Received
                    </p>
                  </div>
                </div>
              </div>
              <div className="details ml15 ml0-md mb15-md">
                <p className="text mt10">
                  {data?.description
                    ? data?.description
                    : "Many desktop publishing packages and web page editors now use Lorem Ipsum  as their default model text."}{" "}
                </p>
              </div>
              <div className="skill-tags d-flex align-items-center justify-content-start mb20-md">
                {data?.skillRequired ? data?.skillsRequired?.map((item: any, i: number) => (
                  <span key={i} className={`tag ${i === 1 ? "mx-10" : ""}`}>
                    {item}
                  </span>
                )) : null}
              </div>
            </div>
            <div  className="right-section details pl-6 border-l border-gray col-span-3">
              <div  className="text-lg-end">
                <h4>
                  ${data?.priceRange?.min}- ${data?.priceRange?.max}
                </h4>
                <Link
                  href={`/project/${id}`}
                  className="border py-4 px-12 border-lime-500 text-lime-500 block"
                >
                  Apply Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
