"use client";

import { Label, TextInput, Button } from "flowbite-react";
import { MdOutlineSearch } from "react-icons/md";

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const search = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    console.log("Searching...");
  };

  return (
    <form onSubmit={search} className="flex max-w-full flex-col">
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          id="search"
          type="search"
          icon={MdOutlineSearch}
          placeholder={placeholder}
        />
        <Button
          type="submit"
          color="purple"
          size="xs"
          className="w-1/4 text-white text-lg purple-700 py-2 rounded-md transition duration-300"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
