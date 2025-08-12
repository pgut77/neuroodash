import PomodoroTimer from "../components/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-9">⏱ Pomodoro</h1>
      <PomodoroTimer />
    </div>
  )
}

