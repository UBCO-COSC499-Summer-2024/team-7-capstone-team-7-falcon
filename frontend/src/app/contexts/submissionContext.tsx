"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Submission } from "../typings/backendDataTypes";
import { examsAPI } from "../api/examAPI";

interface SubmissionContextType {
  submissions?: Submission[];
}

const SubmissionContext = createContext<SubmissionContextType>({});

// provider provides context and parses the information into Submission[]
const SubmissionProvider: React.FC<{
  children: ReactNode;
  course_id: number;
  exam_id: number;
}> = ({ children, course_id, exam_id }) => {
  const [submissions, setSubmissionData] = useState<Submission[] | undefined>(
    undefined,
  );
  useEffect(() => {
    if (course_id && exam_id) {
      const fetchSubmissionData = async () => {
        const result = await examsAPI.getSubmissions(course_id, exam_id);
        const submissionData: Submission[] = result.data.map((item: any) => ({
          student_id: item.student.id,
          user: {
            avatar_url: item.student.user.avatar_url,
            name: `${item.student.user.first_name} ${item.student.user.last_name}`,
          },
          score: item.score,
          updated_at: new Date(Number(item.updated_at)).toLocaleString(),
        }));
        if (JSON.stringify(submissionData) !== JSON.stringify(submissions)) {
          setSubmissionData(submissionData);
        }
      };

      fetchSubmissionData();
    }
  }, [course_id, exam_id]);

  return (
    <SubmissionContext.Provider value={{ submissions }}>
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissionContext = () => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error(
      "useSubmissionContext must be used within a SubmissionProvider",
    );
  }

  return context;
};

export default SubmissionProvider;
