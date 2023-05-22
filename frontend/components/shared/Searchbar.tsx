"use client";

import Icons from "./Icons";

interface SearchbarProps {
  search?: string;
  placeholder?: string;
  setSearch?: (search: string) => void;
}

const Searchbar = ({ search = "", setSearch, placeholder }: SearchbarProps) => {
  return (
    <div className="searchbar">
      <div className="searchbar__icon">
        <Icons.Search />
      </div>
      <input
        type="text"
        value={search}
        placeholder={placeholder || "Search"}
        onChange={e => setSearch && setSearch(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;
