import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      id="not-found-page"
      className="flex items-center justify-center h-screen"
    >
      <Card className="p-8 text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-red-500" />
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Trang không khả dụng</p>
      </Card>
    </div>
  );
}
