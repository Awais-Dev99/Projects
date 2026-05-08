import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullPage = false }: { fullPage?: boolean }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  );

  if (fullPage) {
    return <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[200] flex items-center justify-center">{content}</div>;
  }

  return <div className="py-12 w-full flex items-center justify-center">{content}</div>;
}