import Notas from "@/pages/notas";
import { Toaster } from "@/components/ui/toaster";

export default function NotasExample() {
  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <Notas />
      </div>
      <Toaster />
    </>
  );
}
