"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ErrorCode, Tag } from "@/types";
import { createTagAction } from "@/app/posts/create/action";
import { LoadingSpinner } from "./loading-spinner";

interface TagsComboboxProps {
  tags: Tag[];
  onSelect: (selectedId: number) => void;
  placeholder?: string;
  addNewTag: (tag: Tag) => void;
}

export function TagsCombobox({
  placeholder,
  tags,
  onSelect,
  addNewTag,
}: TagsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ErrorCode>();

  const createNewTag = async () => {
    try {
      setError(undefined);
      setLoading(true);
      const { data, errorCode } = await createTagAction({ name: value });
      setLoading(false);

      if (errorCode || !data?.tag) {
        setError(errorCode ?? "internal_server_error");
        return;
      }

      addNewTag(data.tag);
      setValue("");
      setOpen(false);
    } catch (error) {
      setLoading(false);
      setError("internal_server_error");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {placeholder || "اختر التصنيفات..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="ابحث عن تصنيف..."
            onValueChange={v => setValue(v)}
          />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col gap-4 px-4">
                التصنيف غير موجود
                <Button disabled={loading} type="button" onClick={createNewTag}>
                  {loading && <LoadingSpinner />}
                  إضافة &lsquo;{value}&rsquo;
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {tags.map(tag => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={currentValue => {
                    setValue(currentValue);
                    onSelect(tag.id);
                    setOpen(false);
                  }}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
