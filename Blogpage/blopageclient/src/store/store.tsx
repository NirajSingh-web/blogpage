import axios from "axios";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface DataContextType {
  data: any;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchdata = async () => {
     try {
      const token=localStorage.getItem("token")
      if (token) {
        const res = await axios.get("http://localhost:4000/user/getdata", {
          headers: { "auth-token": token },
        });
        const userdata = await res.data;
        console.log(userdata.userdata)
        setData(userdata.userdata);
      }
     } catch (error:any) {
      console.log(error.message)
     }
    };
    fetchdata();
  }, []);

  return (
    <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>
  );
};
