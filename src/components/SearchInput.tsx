'use client';

import { useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  className?: string;
  inputClassName?: string;
}

export default function SearchInput({ className = '', inputClassName = '' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 w-full max-w-md ${className}`}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className={inputClassName}
      />
    </form>
  );
}
