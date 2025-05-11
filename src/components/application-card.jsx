import { Boxes, BriefcaseBusiness, Download, School, Calendar, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-900/50 text-blue-200';
      case 'interviewing':
        return 'bg-yellow-900/50 text-yellow-200';
      case 'hired':
        return 'bg-green-900/50 text-green-200';
      case 'rejected':
        return 'bg-red-900/50 text-red-200';
      default:
        return 'bg-gray-800/50 text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">
            {isCandidate
              ? application?.job?.title
              : application?.name}
          </h3>
          {isCandidate && (
            <div className="flex items-center gap-2 text-gray-400">
              <Building2 size={16} />
              <span>{application?.job?.company?.name}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-colors"
        >
          <Download size={18} className="text-blue-400" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2 text-gray-300">
          <BriefcaseBusiness size={16} className="text-blue-400" />
          <span>{application?.experience} years of experience</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <School size={16} className="text-blue-400" />
          <span>{application?.education}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Boxes size={16} className="text-blue-400" />
          <span>Skills: {application?.skills}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={16} />
          <span>{new Date(application?.created_at).toLocaleString()}</span>
        </div>
        
        {isCandidate ? (
          <div className={`px-4 py-2 rounded-xl ${getStatusColor(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </div>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className={`w-52 ${getStatusColor(application.status)}`}>
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;