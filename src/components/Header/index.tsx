import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header(): JSX.Element {
  return (
    <header>
      <nav className="bg-white">
        <ul className="flex items-center space-x-2 px-4 py-2">
          <li>
            <Button asChild variant="ghost" size="sm">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" size="sm">
              <Link
                to="/chat"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
