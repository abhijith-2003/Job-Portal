import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger,AccordionContent } from "@/components/ui/accordion";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { socialIcons } from "@/data/socialIcons";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";

const news = [
  { img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", title: "How to Ace Your Next Interview", desc: "Tips and tricks to stand out in your next job interview." },
  { img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", title: "Top 10 Tech Skills in 2024", desc: "Stay ahead with the most in-demand skills this year." },
  { img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80", title: "Remote Work: Pros & Cons", desc: "Is remote work right for you? Explore the benefits." },
];

const LandingPage = () => {
  const { user, isLoaded } = useUser();
  const isRecruiter = user?.unsafeMetadata?.role === "recruiter";
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getJobs({ limit: 6 })
      .then((data) => {
        setFeaturedJobs(Array.isArray(data) ? data : data?.jobs || []);
      })
      .catch((err) => {
        setFeaturedJobs([]);
      });
  }, []);

  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">

      <section className="text-center ">
        <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Career Role
          <span className="flex items-center gap-5 sm:gap-6">
            and get Job</span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-sm lg:text-sm uppercase">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>

      <SignedOut>
        <section className="flex gap-8 justify-center mt-5">
        <Link to={"/jobs"}>
                <Button variant="blue" size="xl" className="w-[210px]">
                  Job Seekers
                </Button>
              </Link>
              <Link to={"/post-job"}>
                <Button variant="destructive" size="xl" className="w-[210px]">
                  For Employers
                </Button>
              </Link>
        </section>
      </SignedOut>

      <div className="flex gap-6 justify-center">
        <SignedIn>
          {isRecruiter ? (
            <>
              <Link to={"/jobs"}>
                <Button variant="blue" size="xl" className="w-[210px]">
                  Jobs List
                </Button>
              </Link>
              <Link to={"/post-job"}>
                <Button variant="destructive" size="xl">
                  Post a Job
                </Button>
              </Link>
            </>
          ) : (
            <Link to={"/jobs"}>
              <Button variant="blue" size="xl">
                Find Jobs
              </Button>
            </Link>
          )}
        </SignedIn>
      </div>

      <Carousel plugins={[Autoplay({
        delay:2000,stopOnInteraction:true
      })]}
      className='w-full py-10'>
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>


      {/* <img src="/banner.jpeg" className="w-full" /> */}

     

      {/* <section className="mx-auto max-w-7xl w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Job</h2>
          <Button variant="blue" className="rounded-lg px-6 py-2">See All Jobs</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job, idx) => (
            <div key={idx} className={`flex flex-col gap-4 ${job.color} bg-white/10 backdrop-blur-sm border border-gray-200/10 rounded-2xl p-6 text-white shadow-lg`}>
              <div className="flex items-center gap-4">
                <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-xl bg-white/20 p-2" />
                <div>
                  <div className="font-bold text-lg">{job.title}</div>
                  <div className="text-gray-300 text-sm">{job.company}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">{job.location}</span>
                <span className="bg-white/10 px-3 py-1 rounded-full">{job.type}</span>
              </div>
              <Button variant="blue" className="rounded-lg mt-2">Apply Now</Button>
            </div>
          ))}
        </div>
      </section> */}
 

      <section className="mx-auto max-w-7xl mt-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Latest News</h2>
       
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <div key={idx} className="flex flex-col bg-white/5 backdrop-blur-sm border border-gray-200/10 rounded-2xl overflow-hidden shadow-lg">
              <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-6 flex flex-col gap-2">
                <div className="font-bold text-lg text-white">{item.title}</div>
                <div className="text-gray-300 text-sm">{item.desc}</div>
              
              </div>
            </div>
          ))}
        </div>
      </section>

     <section className="w-full max-w-7xl mx-auto px-4 py-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Our Platform</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover a smarter way to connect talent with opportunity. Our platform is designed to make your job search or hiring process seamless and efficient.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 p-6 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
            <div className="bg-indigo-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Advanced Search</h3>
            <p className="text-gray-400 text-sm">Powerful filters and AI-driven recommendations to find your perfect match</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 p-6 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
            <div className="bg-pink-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Profiles</h3>
            <p className="text-gray-400 text-sm">Trust in our verified user profiles and company listings</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-400 text-sm">Stay informed with instant notifications and status updates</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
            <div className="bg-amber-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-400 text-sm">Your data is protected with enterprise-grade security</p>
          </div>
        </div>
      </section>
      
      <section className="w-full max-w-4xl mx-auto border border-gray-200/20 rounded-2xl bg-transparent p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="flex flex-col items-center ">
        <p className="text-center text-lg max-w-xl font-medium">
          Discover new opportunities and unlock your career potential.
        </p>
        <p className="text-center text-base max-w-md font-normal mt-1">
          Your dream job is just a few clicks away.
        </p>
        <p className="text-center text-sm max-w-xs font-light mt-1">
          Start your journey today.
        </p>
      </section>

    </main>
  );
};

export default LandingPage;