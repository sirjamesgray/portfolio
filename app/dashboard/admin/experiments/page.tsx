import { TimeMachine } from "@/components/time-machine";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        <div className="px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Experiments
          </h1>
          <p className="text-muted-foreground">
            Experimental UI components and features
          </p>
        </div>

        {/* Time Machine Component */}
        <TimeMachine />
      </main>
    </div>
  );
}
