
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, History, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface SearchBarProps {
  currentSearch: string;
  searchHistory: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onHistorySelect: (search: string) => void;
  onClearHistory: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  currentSearch,
  searchHistory,
  onSearchChange,
  onSearchSubmit,
  onHistorySelect,
  onClearHistory,
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="relative flex-1">
      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Search products, brands..."
        className="pl-10 border-2 border-[#6f7d95] py-3 rounded-xl"
        value={currentSearch}
        onChange={onSearchChange}
      />
      {searchHistory.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <History className="h-5 w-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm font-medium">Recent Searches</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearHistory();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Separator />
            {searchHistory.map((search, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onHistorySelect(search)}
              >
                {search}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </form>
  );
};

export default SearchBar;
