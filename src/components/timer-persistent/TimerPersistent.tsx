import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimerPersistentProps {
  defaultMinutes?: number;
  className?: string;
}

interface TimerState {
  remainingSeconds: number;
  isRunning: boolean;
  lastStartTimestamp: number | null;
}

const STORAGE_KEY = "persistent-timer-state";

export function TimerPersistent({ defaultMinutes = 25, className }: TimerPersistentProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [lastStartTimestamp, setLastStartTimestamp] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Restore timer state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: TimerState = JSON.parse(saved);
        if (
          typeof parsed.remainingSeconds === "number" &&
          typeof parsed.isRunning === "boolean"
        ) {
          let seconds = parsed.remainingSeconds;
          // If running, calculate elapsed time
          if (parsed.isRunning && parsed.lastStartTimestamp) {
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - parsed.lastStartTimestamp;
            seconds = Math.max(0, seconds - elapsed);
            if (seconds === 0) {
              setIsRunning(false);
              setLastStartTimestamp(null);
            }
          }
          setRemainingSeconds(seconds);
          setIsRunning(parsed.isRunning && seconds > 0);
          setLastStartTimestamp(
            parsed.isRunning && seconds > 0 ? Math.floor(Date.now() / 1000) : null
          );
        }
      } catch {}
    }
  }, []);

  // Save timer state to localStorage on change
  useEffect(() => {
    const state: TimerState = {
      remainingSeconds,
      isRunning,
      lastStartTimestamp: isRunning ? lastStartTimestamp : null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [remainingSeconds, isRunning, lastStartTimestamp]);

  // Timer tick
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setLastStartTimestamp(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remainingSeconds]);

  function handleStart() {
    if (remainingSeconds > 0) {
      setIsRunning(true);
      setLastStartTimestamp(Math.floor(Date.now() / 1000));
    }
  }

  function handlePause() {
    setIsRunning(false);
    setLastStartTimestamp(null);
  }

  function handleReset() {
    setIsRunning(false);
    setRemainingSeconds(defaultMinutes * 60);
    setLastStartTimestamp(null);
  }

  // Format time as mm:ss
  function formatTime(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 w-full max-w-xs mx-auto p-6 rounded-xl bg-card shadow-lg border border-border",
        className
      )}
    >
      <h1 className="font-semibold text-3xl mb-2">Persistent Timer</h1>
      <div className="text-6xl font-mono tabular-nums" aria-live="polite">
        {formatTime(remainingSeconds)}
      </div>
      <div className="flex gap-2 mt-2">
        {isRunning ? (
          <Button variant="secondary" onClick={handlePause} aria-label="Pause timer">
            Pause
          </Button>
        ) : (
          <Button variant="default" onClick={handleStart} aria-label="Start timer" disabled={remainingSeconds === 0}>
            Start
          </Button>
        )}
        <Button variant="ghost" onClick={handleReset} aria-label="Reset timer">
          Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Timer state is saved automatically and will persist across page reloads.
      </p>
    </div>
  );
}
