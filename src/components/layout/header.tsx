'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center px-6 gap-4">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-9"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold select-none">
          DG
        </div>
      </div>
    </header>
  );
}
