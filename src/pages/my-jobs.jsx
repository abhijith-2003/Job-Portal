import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Briefcase, FileText } from "lucide-react";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-gray-800/50 rounded-2xl mb-6">
          {isCandidate ? (
            <FileText className="w-8 h-8 text-blue-400" />
          ) : (
            <Briefcase className="w-8 h-8 text-blue-400" />
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {isCandidate ? "Applications" : "Posted Jobs"}
        </h1>
        <p className="text-gray-400 text-lg">
          {isCandidate 
            ? "Track and manage your job applications"
            : "Manage your posted job listings and applications"
          }
        </p>
      </div>

      <div className="bg-gray-900/50 rounded-3xl shadow-lg p-8 border border-gray-700/50">
        {isCandidate ? (
          <CreatedApplications />
        ) : (
          <CreatedJobs />
        )}
      </div>
    </div>
  );
};

export default MyJobs;