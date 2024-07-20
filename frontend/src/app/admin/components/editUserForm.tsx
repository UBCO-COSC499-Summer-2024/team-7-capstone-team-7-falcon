"use client";

import React, { useState, useEffect } from "react";
import { TextInput, Label } from "flowbite-react";
import { usersAPI } from "@/app/api/usersAPI";
import toast from "react-hot-toast";
import { UserEditData, User } from "@/app/typings/backendDataTypes";
import { useRouter } from "next/navigation";
import Avatar from "../../components/avatar";

interface EditUserFormProps {
  userId: number;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userId }) => {
  const [formData, setFormData] = useState<UserEditData>({
    first_name: "",
    last_name: "",
    student_id: -1,
    employee_id: -1,
  });
  const [savingChanges, setSavingChanges] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user: User | null = await usersAPI.getUserDetails();
      if (user) {
        setFormData({
          first_name: user.first_name,
          last_name: user.last_name ?? "", //set to an empty string if the last name is null
          student_id: user.student_user?.id || -1,
          employee_id: user.employee_user?.id || -1,
        });
        setAvatarUrl(user.avatar_url);
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      toast.error("Failed to load user data");
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSavingChanges(true);

      const updatedUser = await usersAPI.editUser(userId, formData);

      if (updatedUser && updatedUser.status === 200) {
        toast.success("User successfully updated");
        fetchUserData(); // Refresh the user data
      } else {
        toast.error("Failed to update user");
        console.error("Error response:", updatedUser);
      }
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Catch error:", error);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDeletePicture = async () => {
    try {
      await usersAPI.deleteProfilePicture(userId);
      setAvatarUrl(null);
      toast.success("Profile picture deleted");
    } catch (error) {
      toast.error("Failed to delete profile picture");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <form method="PATCH" onSubmit={handleSaveChanges}>
        <div className="space-y-4 p-4 ring ring-gray-100 rounded-md flex flex-col">
          <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center">
              <Avatar
                avatarUrl={avatarUrl ?? undefined}
                firstName={formData.first_name}
                lastName={formData.last_name}
                imageWidth={200}
                imageHeight={200}
                imageTextWidth="w-48"
                imageTextHeight="h-48"
                textSize={4}
              />
              <button
                type="button"
                className="btn-primary mt-4"
                onClick={handleDeletePicture}
              >
                Delete Picture
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">
                <h2>First Name</h2>
              </Label>
              <TextInput
                id="first_name"
                name="first_name"
                className="mb-3"
                value={formData.first_name}
                placeholder="Enter first name"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="last_name">
                <h2>Last Name</h2>
              </Label>
              <TextInput
                id="last_name"
                name="last_name"
                className="mb-3"
                value={formData.last_name}
                placeholder="Enter last name"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_id">
                <h2>Employee Number</h2>
              </Label>
              <TextInput
                id="employee_id"
                name="employee_id"
                className="mb-3"
                value={
                  formData.employee_id === -1
                    ? ""
                    : formData.employee_id.toString()
                }
                placeholder="Enter employee number"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="student_id">
                <h2>Student Number</h2>
              </Label>
              <TextInput
                id="student_id"
                name="student_id"
                className="mb-3"
                value={
                  formData.student_id === -1
                    ? ""
                    : formData.student_id.toString()
                }
                placeholder="Enter student number"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="btn-primary w-full disabled:bg-purple-400"
              disabled={savingChanges}
            >
              {savingChanges ? "Saving Changes..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
