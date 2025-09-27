import PomodoroTimer from "../components/PomodoroTimer";

export default function PomodoroPage() {
  return (
    <div className="bg-black text-white rounded-xl p-6 shadow-lg max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-9">⏱ Pomodoro</h1>
      <PomodoroTimer />
    </div>
  )
}

