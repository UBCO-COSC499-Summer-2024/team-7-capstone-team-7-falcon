import { useState, useEffect } from "react";
import { usersAPI } from "../../api/usersAPI";

const useFetchUsersCount = (role?: string) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await usersAPI.getAllUsersCount();

        if (role) {
          const roleCount =
            response.find((item: { role: string }) => item.role === role)
              ?.count || 0;
          setCount(roleCount);
        } else {
          const totalUsersCount = response.reduce(
            (acc: number, curr: { role: string; count: number }) =>
              acc + curr.count,
            0,
          );
          setCount(totalUsersCount);
        }
      } catch (error) {}
    };

    fetchData();
  }, [role]);

  return count;
};

export default useFetchUsersCount;
