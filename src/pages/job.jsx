import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,  
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-transparent rounded-3xl shadow-lg p-8 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            {job?.title}
          </h1>
          <div className="flex items-center gap-3 px-3">
            <img 
              src={job?.company?.logo_url} 
              className="h-20 w-20 object-contain rounded-xl" 
              alt={job?.company?.name} 
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-white">
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-xl">
              <MapPinIcon size={18} className="mr-2 text-blue-400" />
              {job?.location}
            </div>
            <div className="flex items-center bg-gray-800 px-4 py-2 rounded-xl">
              <Briefcase size={18} className="mr-2 text-blue-400" />
              {job?.applications?.length} Applicants
            </div>
            <div className={`flex items-center px-4 py-2 rounded-xl ${
              job?.isOpen 
                ? "bg-teal-900 text-teal-200" 
                : "bg-red-900 text-red-200"
            }`}>
              {job?.isOpen ? (
                <>
                  <DoorOpen size={18} className="mr-2" /> Open
                </>
              ) : (
                <>
                  <DoorClosed size={18} className="mr-2" /> Closed
                </>
              )}
            </div>
          </div>

          {job?.recruiter_id !== user?.id && (
            <ApplyJobDrawer
              job={job}
              user={user}
              fetchJob={fnJob}
              applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
            />
          )}
        </div>

        {job?.recruiter_id === user?.id && (
          <div className="mt-6">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-full ${
                  job?.isOpen 
                    ? "bg-teal-900 text-teal-200 border-teal-700" 
                    : "bg-red-900 text-red-200 border-red-700"
                }`}
              >
                <SelectValue
                  placeholder={
                    "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="bg-transparent rounded-3xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">About the job</h2>
        <p className="text-gray-300 leading-relaxed">{job?.description}</p>
      </div>

      <div className="bg-transparent rounded-3xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
        <MDEditor.Markdown
          source={job?.requirements}
          className="prose prose-invert max-w-none bg-transparent"
        />
      </div>

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="bg-transparent rounded-3xl shadow-lg p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <div className="text-gray-400">
              Total Applications: {job?.applications?.length}
            </div>
          </div>
          <div className="grid gap-6">
            {job?.applications.map((application) => (
              <div key={application.id} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                <ApplicationCard application={application} />
              </div>
            ))}
          </div>
        </div>
      )}

      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
    </div>
  );
};

export default JobPage;