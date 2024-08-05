"use client";
import React, { useState, useEffect } from "react";
import { TextInput, Label } from "flowbite-react";
import { coursesAPI } from "@/app/api/coursesAPI";
import SemesterSelect from "./semesterSelect";
import toast, { Toaster } from "react-hot-toast";
import { CourseEditData, Course } from "@/app/typings/backendDataTypes";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

interface CourseEditFormProps {
  courseId: number;
  redirectPath?: string;
}

const CourseEditForm: React.FC<CourseEditFormProps> = ({
  courseId,
  redirectPath = "../../courses",
}) => {
  const [formData, setFormData] = useState<CourseEditData>({
    courseName: "",
    courseCode: "",
    semesterId: -1,
    inviteCode: "",
  });
  const router = useRouter();
  const [savingChanges, setSavingChanges] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const course: Course = await coursesAPI.getCourse(courseId);
      setFormData({
        courseName: course.course_name,
        courseCode: course.course_code,
        semesterId: course.semester.id ?? -1,
        inviteCode: course.invite_code ?? "",
      });
      setCourseData(course);
    } catch (error) {
      toast.error("Failed to load course or semester data");
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setSavingChanges(true);

      const updatedCourse = await coursesAPI.editCourse(courseId, formData);

      if (
        updatedCourse &&
        (updatedCourse.course_name !== courseData?.course_name ||
          updatedCourse.course_code !== courseData?.course_code)
      ) {
        toast.success("Course successfully updated");
        router.refresh();
      } else {
        if (updatedCourse && updatedCourse.status) {
          setFormData({
            courseName: updatedCourse.course_name,
            courseCode: updatedCourse.course_code,
            semesterId: updatedCourse.semester_id ?? -1,
            inviteCode: updatedCourse.invite_code ?? "",
          });
          toast.success("Course successfully updated");

          await fetchData();
        } else {
          toast.error(updatedCourse.response.data.message);
        }
      }
    } catch (error) {
      toast.error("Failed to update course");
    } finally {
      setSavingChanges(false);
    }
  };

  const archiveCourse = async () => {
    try {
      await coursesAPI.archiveCourse(courseId);
      toast.success("Course successfully archived");
      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    } catch (error) {
      toast.error("Failed to archive course");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "semester_id" ? Number(value) : value,
    });
  };

  const unsecureCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Invite link copied to clipboard");
    } catch {
      toast.error("Unable to copy to clipboard");
    }
    document.body.removeChild(textArea);
  };

  const copyInviteLink = () => {
    const inviteLink = formData.inviteCode;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/student/course/${courseId}/invite?code=${inviteLink}`,
      );
      toast.success("Invite link copied to clipboard");
    } else {
      unsecureCopyToClipboard(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/student/course/${courseId}/invite?code=${inviteLink}`,
      );
    }
  };

  const generateInviteCode = () => {
    const newInviteCode = uuidv4();
    setFormData({ ...formData, inviteCode: newInviteCode });
  };

  return (
    <div>
      <Toaster />
      <form method="PATCH" onSubmit={handleSaveChanges}>
        <div className="space-y-4 p-4 ring ring-gray-100 rounded-md flex flex-col">
          <Label htmlFor="courseCode">
            <h2>Course Code</h2>
          </Label>
          <TextInput
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="Enter course Code"
            required
            className="mb-3"
          />
          <Label htmlFor="courseName">
            <h2 className="pt-2">Course Name</h2>
          </Label>
          <TextInput
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="Enter course name"
            required
            className="mb-3"
          />

          <SemesterSelect
            name="semesterId"
            required={true}
            labelText="Semester"
            value={formData.semesterId}
            onChange={handleChange}
          />

          <Label htmlFor="inviteCode" className="mb-3">
            <h2 className="pt-2">Invite Code</h2>
          </Label>
          <div className="relative flex items-center mb-4">
            <div className="relative w-1/4">
              <TextInput
                id="inviteCode"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                required
                className="w-full"
              />
              <button
                type="button"
                className="btn-primary absolute top-1/2 right-0 transform -translate-y-1/2"
                onClick={generateInviteCode}
              >
                <svg
                  className="w-5 h-5 text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
                  />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="btn-primary ml-2"
              onClick={copyInviteLink}
            >
              Copy Invite Link
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="btn-primary w-ful disabled:bg-purple-400"
              disabled={savingChanges}
            >
              {savingChanges ? "Saving Changes..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
      <div className="ring-1 rounded ring-red-700 pt-4 mt-4 flex flex-col p-4">
        <p className="font-bold text-lg mb-2">Danger Zone</p>
        <p className="font-bold mt-2">Archive this Course</p>
        <p>Once you archive this course, users will not be able to access it</p>
        <button
          className="ring-1 rounded ring-red-700 p-1 m-3 items-center"
          onClick={archiveCourse}
        >
          <p className="text-red-700 text-lg">Archive this course</p>
        </button>
      </div>
    </div>
  );
};

export default CourseEditForm;
