import Estudiantes from "@/pages/estudiantes";
import { Toaster } from "@/components/ui/toaster";

export default function EstudiantesExample() {
  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <Estudiantes />
      </div>
      <Toaster />
    </>
  );
}
