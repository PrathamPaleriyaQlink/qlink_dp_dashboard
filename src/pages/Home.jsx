import React, { useEffect, useRef, useState } from "react";
import StatsCard from "../components/ui/StatsCard";
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
// import { getAnalytics } from "../api_utils/api_routes";

const Home = () => {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [data, setData] = useState(null)

  const showWarn = () => {
        toast.current.show({severity:'error', summary: 'Error Occured while fetching details, Please Refresh.', detail:alert , life: 3000});
    }

  // const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await getAnalytics();
  //       setData(res);
  //     } catch (error) {
  //       toast.current.show({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "Error occured while fetching event details. Please Refresh",
  //         life: 3000,
  //       });
  //     }
  //     setLoading(false);
  //   };
  

    useEffect(() => {
      fetchData()
    }, [])
 

  return (
    <div className="w-full my-10">
      <Toast ref={toast} />
      { loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-5">
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
          <Skeleton height="120px" width="100%" borderRadius="10px"/>
        </div>
      ) : !data  ? (<div className="text-gray-500">No Analytics Available</div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-5">
        <StatsCard 
          title={"Total Users"}
          value={data.total_users}
          icon={"users"}
        />
        <StatsCard 
          title={"Total Interactions"}
          value={data.total_interactions}
          icon={"inbox"}
        />
        <StatsCard 
          title={"Avg Interaction per users"}
          value={data.average_interactions_per_user.toFixed(2)}
          icon={"send"}
        />
      </div>
      )}
    </div>
  );
};

export default Home;
