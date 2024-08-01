"use client";

import React, { useState, useEffect } from "react";
import { TextInput, Label } from "flowbite-react";
import { usersAPI } from "@/app/api/usersAPI";
import toast from "react-hot-toast";
import { UserEditData, User } from "@/app/typings/backendDataTypes";
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
  const [domLoaded, setDomLoaded] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user: User | null = await usersAPI.getUserDetailsById(userId);
      if (user) {
        setFormData({
          first_name: user.first_name,
          last_name: user.last_name.toString() ?? "", //set to an empty string if the last name is null
          student_id: user.student_user?.student_id ?? -1,
          employee_id: user.employee_user?.employee_id ?? -1,
        });
        setDomLoaded(true);
        setAvatarUrl(user.avatar_url);
        setUserData(user);
      } else {
        throw new Error("Failed to load user data");
      }
    } catch (error) {
      throw new Error("Failed to load user data");
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSavingChanges(true);
      console.log(userData);
      console.log(formData);
      if (
        formData.first_name === userData?.first_name &&
        formData.last_name === userData?.last_name &&
        formData.student_id === userData?.student_user?.student_id &&
        formData.employee_id === userData?.employee_user?.employee_id
      ) {
        toast.error("No changes to save");
        return;
      }

      if (formData.student_id === null) {
        setFormData({
          ...formData,
          student_id: userData?.student_user?.student_id,
        });
        toast.error("Student ID cannot be deleted");
        return;
      }

      if (formData.employee_id === null) {
        setFormData({
          ...formData,
          employee_id: userData?.employee_user?.employee_id,
        });
        toast.error("Employee ID cannot be deleted");
        return;
      }

      if (
        userData?.employee_user &&
        userData.employee_user.employee_id === formData.employee_id
      ) {
        delete formData.employee_id;
      } else if (
        userData?.student_user &&
        userData.student_user.student_id === formData.student_id
      ) {
        delete formData.student_id;
      } else if (
        userData?.employee_user &&
        userData?.student_user &&
        userData.employee_user.employee_id === formData.employee_id &&
        userData.student_user.student_id === formData.student_id
      ) {
        delete formData.employee_id;
        delete formData.student_id;
      }

      if (formData.student_id === -1) {
        delete formData.student_id;
      }

      if (formData.employee_id === -1) {
        delete formData.employee_id;
      }

      const updatedUser = await usersAPI.editUser(userId, formData);

      if (updatedUser && updatedUser.status === 200) {
        toast.success("User successfully updated");
        await fetchUserData(); // Refresh the user data
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "student_id" || name === "employee_id") {
      setFormData({
        ...formData,
        [name]: value === "" || value === undefined ? null : Number(value),
      });
      return;
    }

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
    domLoaded && (
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
                  className="btn-primary mt-4 disabled:bg-purple-400"
                  onClick={handleDeletePicture}
                  disabled={avatarUrl === null}
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
                  type="number"
                  value={
                    formData.employee_id === -1
                      ? ""
                      : Number(formData.employee_id)
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
                  type="number"
                  value={
                    formData.student_id === -1
                      ? ""
                      : Number(formData.student_id)
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
    )
  );
};

export default EditUserForm;
