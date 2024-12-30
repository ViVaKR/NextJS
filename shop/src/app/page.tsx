import { Button } from '@/components/ui/button';
import { ChevronRight, MailOpen } from 'lucide-react';

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-4 w-full h-full p-8 gap-2">
        <Button variant="destructive">Click me</Button>

        {/* buttonVariants */}
        <Button variant="outline">
          <ChevronRight />
        </Button>

        <Button>
          <MailOpen /> Login with Email
        </Button>
      </div>
    </>
  );
}
