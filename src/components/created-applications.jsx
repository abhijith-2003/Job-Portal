import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { FileText } from "lucide-react";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (!applications?.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-3 bg-gray-800/50 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
        <p className="text-gray-400">You haven't applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Applications</h2>
        <div className="text-gray-400 bg-gray-800/50 px-4 py-2 rounded-xl">
          {applications.length} Total Applications
        </div>
      </div>
      
      <div className="grid gap-6">
        {applications?.map((application) => (
          <div
            key={application.id}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all"
          >
            <ApplicationCard
              application={application}
              isCandidate={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatedApplications;