import React, { useEffect, useRef, useState } from "react";
import StatsCard from "../components/ui/StatsCard";
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { getAnalytics } from "../api_utils/api_routes";

const Home = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAnalytics();
      setData(res);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error occurred while fetching analytics. Please refresh.",
        life: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full my-10">
      <Toast ref={toast} />
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5">
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
        </div>
      ) : !data ? (
        <div className="text-gray-500">No Analytics Available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5">
          <StatsCard 
            title={"Total Campaigns"}
            value={data.total_campaign}
            icon={"megaphone"}
            color="bg-blue-500"
          />
          <StatsCard 
            title={"Total Messages Sent"}
            value={data.total_messages_sent}
            icon={"send"}
            color="bg-indigo-500"
          />
          <StatsCard 
            title={"Total Delivered"}
            value={data.total_delivered}
            icon={"check-circle"}
            color="bg-green-500"
          />
          <StatsCard 
            title={"Total Read"}
            value={data.total_read}
            icon={"eye"}
            color="bg-teal-500"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
