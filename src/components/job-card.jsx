import { Bookmark, MapPinIcon, Trash2Icon, Building2, Users, Calendar, DollarSign, Clock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col bg-background border-input hover:border-input/80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-1">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-white">
            {job.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 size={16} className="text-blue-400" />
            <span>{job.company?.name}</span>
          </div>
        </div>
        {isMyJob ? (
          <button
            onClick={handleDeleteJob}
            className="p-2 bg-red-900/50 hover:bg-red-800/50 rounded-lg transition-all hover:scale-110 active:scale-95"
          >
            <Trash2Icon size={18} className="text-red-400" />
          </button>
        ) : (
          <button
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all hover:scale-110 active:scale-95"
          >
            <Bookmark 
              size={18} 
              className={saved ? "text-red-400 fill-red-400" : "text-blue-400"} 
            />
          </button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between text-gray-400">
          <div className="flex items-center gap-2">
            <MapPinIcon size={16} className="text-blue-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span> {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {job.salary && (
            <div className="flex items-center gap-2 text-gray-300">
              <DollarSign size={16} className="text-blue-400" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.type && (
            <div className="flex items-center gap-2 text-gray-300">
              <Clock size={16} className="text-blue-400" />
              <span>{job.type}</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 line-clamp-2">
          {job.description.substring(0, job.description.indexOf("."))}.
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4 border-t border-input/50">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button 
            variant="blue" 
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;