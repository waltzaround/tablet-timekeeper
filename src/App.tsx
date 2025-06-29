import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "./components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { X, Upload, Link, Trash2 } from "lucide-react";
import { Input } from "./components/ui/input";
import { KeyboardAwareInput } from "./components/KeyboardAwareInput";
import { useState, useEffect } from "react";
import Aurora from "./components/Aurora";

// Define the interval type
interface Interval {
  id: string;
  name: string;
  minutes: number;
}

function App() {
  // State for intervals
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoFile, setLogoFile] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  // Slideshow state
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerComplete, setTimerComplete] = useState<boolean>(false);

  // Immediate localStorage test
  console.log('App component rendering...');
  console.log('Current localStorage timer-intervals:', localStorage.getItem('timer-intervals'));
  console.log('Has loaded flag:', hasLoaded);

  // Calculate total duration from intervals
  const totalMinutes = intervals.reduce((sum, interval) => sum + interval.minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // Calculate total remaining time
  const calculateTotalRemainingSeconds = () => {
    if (!isTimerActive || intervals.length === 0) return 0;
    
    // Add remaining time in current interval
    let total = timeRemaining;
    
    // Add time from future intervals
    for (let i = currentIntervalIndex + 1; i < intervals.length; i++) {
      total += intervals[i].minutes * 60;
    }
    
    return total;
  };
  
  const totalRemainingSeconds = calculateTotalRemainingSeconds();
  const remainingHours = Math.floor(totalRemainingSeconds / 3600);
  const remainingMins = Math.floor((totalRemainingSeconds % 3600) / 60);
  const remainingSecs = totalRemainingSeconds % 60;

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('=== LOADING FROM localStorage ===');
    console.log('Component mounted, checking localStorage...');
    
    // Load all data at once to prevent race conditions
    const loadAllData = () => {
      // Load intervals
      const savedIntervals = localStorage.getItem('timer-intervals');
      console.log('Raw saved intervals from localStorage:', savedIntervals);
      
      let loadedIntervals = [];
      if (savedIntervals) {
        try {
          const parsedIntervals = JSON.parse(savedIntervals);
          console.log('Successfully parsed intervals:', parsedIntervals);
          console.log('Is array?', Array.isArray(parsedIntervals));
          console.log('Array length:', parsedIntervals?.length);
          
          if (Array.isArray(parsedIntervals)) {
            console.log('Setting intervals state with:', parsedIntervals);
            loadedIntervals = parsedIntervals;
          } else {
            console.log('Parsed data is not an array, skipping...');
          }
        } catch (error) {
          console.error('Failed to parse intervals from localStorage:', error);
        }
      } else {
        console.log('No saved intervals found in localStorage');
      }

      // Load logo
      const savedLogoUrl = localStorage.getItem('timer-logo-url');
      const savedLogoFile = localStorage.getItem('timer-logo-file');
      console.log('Saved logo URL:', savedLogoUrl);
      console.log('Saved logo file exists:', !!savedLogoFile);
      
      // Set all states at once
      setIntervals(loadedIntervals);
      
      if (savedLogoUrl) {
        setLogoUrl(savedLogoUrl);
        setUploadMode('url');
      } else if (savedLogoFile) {
        setLogoFile(savedLogoFile);
        setUploadMode('file');
      }
    };
    
    // Load data first
    loadAllData();
    
    // Then mark as loaded
    setTimeout(() => {
      setHasLoaded(true);
      console.log('=== LOADING COMPLETE ===');
    }, 0);
  }, []); // Empty dependency array to run only on mount

  // Save intervals to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (hasLoaded) {
      console.log('Saving intervals to localStorage:', intervals);
      localStorage.setItem('timer-intervals', JSON.stringify(intervals));
    }
  }, [intervals, hasLoaded]);

  // Manual save function
  const saveCurrentState = () => {
    console.log('Manually saving current state:', intervals);
    localStorage.setItem('timer-intervals', JSON.stringify(intervals));
    if (logoUrl) {
      localStorage.setItem('timer-logo-url', logoUrl);
    }
    if (logoFile) {
      localStorage.setItem('timer-logo-file', logoFile);
    }
  };



  // Save logo to localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (hasLoaded) {
      if (uploadMode === 'url' && logoUrl) {
        localStorage.setItem('timer-logo-url', logoUrl);
        localStorage.removeItem('timer-logo-file');
      } else if (uploadMode === 'file' && logoFile) {
        localStorage.setItem('timer-logo-file', logoFile);
        localStorage.removeItem('timer-logo-url');
      }
    }
  }, [logoUrl, logoFile, uploadMode, hasLoaded]);

  // Clear all data
  const clearAllData = () => {
    setIntervals([]);
    setLogoUrl("");
    setLogoFile("");
    setUploadMode('url');
    
    // Clear localStorage
    localStorage.removeItem('timer-intervals');
    localStorage.removeItem('timer-logo-url');
    localStorage.removeItem('timer-logo-file');
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoFile(result);
        setUploadMode('file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Get current logo source
  const getCurrentLogo = () => {
    if (uploadMode === 'file' && logoFile) {
      return logoFile;
    }
    if (uploadMode === 'url' && logoUrl) {
      return logoUrl;
    }
    return null;
  };

  // Add a new interval
  const addInterval = () => {
    const newInterval: Interval = {
      id: Date.now().toString(),
      name: "",
      minutes: 0
    };
    setIntervals([...intervals, newInterval]);
  };

  // Remove an interval
  const removeInterval = (id: string) => {
    setIntervals(intervals.filter(interval => interval.id !== id));
  };

  // Update an interval
  const updateInterval = (id: string, field: keyof Interval, value: string | number) => {
    setIntervals(intervals.map(interval => 
      interval.id === id 
        ? { ...interval, [field]: field === 'minutes' ? Number(value) || 0 : value }
        : interval
    ));
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Intervals:', intervals);
    console.log('Total Duration:', { hours: totalHours, minutes: remainingMinutes, totalMinutes });
    console.log('Logo:', { mode: uploadMode, url: logoUrl, file: logoFile ? 'Base64 data' : null });
    
    // Save current state before submission
    saveCurrentState();
    
    // Debug localStorage
    console.log('=== localStorage Debug ===');
    console.log('timer-intervals:', localStorage.getItem('timer-intervals'));
    console.log('timer-logo-url:', localStorage.getItem('timer-logo-url'));
    console.log('timer-logo-file:', localStorage.getItem('timer-logo-file'));
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('========================');
    
    // Start the slideshow timer
    if (intervals.length > 0) {
      setIsTimerActive(true);
      setCurrentIntervalIndex(0);
      setTimeRemaining(intervals[0].minutes * 60); // Convert minutes to seconds
      setTimerComplete(false);
      
      // Close the drawer when timer starts
      setDrawerOpen(false);
    }
  };

  // Toggle pause/resume function
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Timer effect to handle countdown and slide transitions
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;
    
    if (isTimerActive && !timerComplete && intervals.length > 0 && !isPaused) {
      timerId = setInterval(() => {
        setTimeRemaining((prev) => {
          // If time is up for current interval
          if (prev <= 1) {
            // Move to next interval or complete
            if (currentIntervalIndex < intervals.length - 1) {
              // Set up next interval
              const nextIndex = currentIntervalIndex + 1;
              setCurrentIntervalIndex(nextIndex);
              return intervals[nextIndex].minutes * 60; // Set time for next interval
            } else {
              // All intervals complete
              setTimerComplete(true);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isTimerActive, currentIntervalIndex, intervals, timerComplete, isPaused]);

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="left">
        {!isTimerActive ? (<>  
          <section className="h-screen w-screen flex items-center justify-center z-[20]">
         
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-4xl">Timer Boi</h1>
              <p>this timer helps you keep track of time lmao</p>
              <DrawerTrigger asChild>
                <Button className="w-full" onClick={() => setDrawerOpen(true)}>Get Started</Button>
              </DrawerTrigger>
            </div>
          </section></>
        ) : (
          <section className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center  w-full p-6">
              {/* Logo display */}
              {getCurrentLogo() && (
                <div className="  rounded overflow-hidden  mb-4 absolute left-4 top-4 ">
                  <img 
                    src={getCurrentLogo()!} 
                    alt="Logo" 
                    className="w-full l object-contain max-w-[24rem] h-[4rem] "
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Current interval info */}
              {!timerComplete ? (
                <>
         
                  
                  {/* Timer display - autoscales based on duration */}
                  <div className="w-full text-center my-8 select-none">
                    <div 
                      className="font-bold tracking-tighter inline-block"
                      style={{
                        fontSize: `34  vw`,
                        lineHeight: '0.8',
                        width: '100%',
                        textAlign: 'center'
                      }}
                    >
                      {Math.floor(timeRemaining / 60).toString().padStart(1, '0')}:
                      {(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                  </div>         <div className="text-center select-none">
                    <h2 className="text-8xl  text-gray-400 mb-2">
                      {intervals[currentIntervalIndex]?.name || `Interval ${currentIntervalIndex + 1}`}
                    </h2>
                    <p className="text-gray-800 text-3xl mt-8">
                      {currentIntervalIndex + 1} of {intervals.length}
                    </p>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-900/40  h-2.5 absolute bottom-0">
                    <div 
                      className="bg-blue-600 h-2.5 " 
                      style={{
                        width: `${100 - (timeRemaining / (intervals[currentIntervalIndex]?.minutes * 60) * 100)}%`
                      }}
                    ></div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex gap-2 absolute top-4 right-4">
                    <Button 
                      variant="outline" 
                      className="text-gray-400 px-6"
                      onClick={() => setIsTimerActive(false)}
                    >
                      Reset
                    </Button>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="text-gray-400 px-6">Settings</Button>
                    </DrawerTrigger>
                  </div>
                  
                  {/* Total time display at bottom left */}
                  <div className="absolute bottom-4 left-4 text-lg font-medium text-gray-600 select-none ">
                    {remainingHours > 0 && `${remainingHours}h `}
                    {remainingMins > 0 || (remainingHours === 0 && remainingSecs === 0) ? `${remainingMins}m` : ''}
                    {remainingSecs > 0 ? ` ${remainingSecs}s` : ''} left
                  </div>
                  
                  {/* Pause/Resume button at bottom right */}
                  <div className="absolute bottom-4 right-4">
                    <Button 
                      onClick={togglePause}
                      variant={isPaused ? "default" : "outline"}
                      className="px-6"
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-[12rem] font-bold mb-6">Time up!</h2>
                  <Button onClick={() => setIsTimerActive(false)}>Reset</Button>
                </div>
              )}
            </div>
          </section>
        )}

    
        <DrawerContent className="h-screen overflow-y-auto overscroll-contain pb-40" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
          <div className="flex justify-between border-b">
            <h2 className="p-4 font-semibold">Timer Settings</h2> <DrawerClose className="p-4 border-l">
              <X />
            </DrawerClose>
          </div>
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold">Total Duration</h3>
            <h3 className="text-2xl font-bold text-blue-600">
              {totalHours > 0 && `${totalHours}h `}{remainingMinutes > 0 || totalHours === 0 ? `${remainingMinutes}m` : ''}
              {totalMinutes === 0 && '0m'}
            </h3>
          </div>

          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold mb-2">Logo</h3>
            
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <Button
                variant={uploadMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMode('url')}
                className="flex items-center gap-1"
              >
                <Link className="w-3 h-3" />
                URL
              </Button>
              <Button
                variant={uploadMode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMode('file')}
                className="flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload
              </Button>
            </div>

            {/* URL Input */}
            {uploadMode === 'url' && (
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="Enter logo URL" 
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
              </div>
            )}

            {/* File Upload */}
            {uploadMode === 'file' && (
              <div className="flex gap-2 items-center">
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
              </div>
            )}

            {/* Logo Preview */}
            {getCurrentLogo() && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded overflow-hidden border">
                  <img 
                    src={getCurrentLogo()!} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {uploadMode === 'file' ? 'Uploaded file' : 'URL image'}
                </div>
              </div>
            )}
          </div>

          <div className=" border-b">    
            <div className="p-4">
              <h2 className=" text-sm font-semibold">Intervals</h2>
              <p className="text-sm text-gray-400">Intervals are periods that you want to track ie: Introduction, Topic 1, Topic 2, Q&A</p>
            </div>
            <Accordion type="single" className="border-t border-b" collapsible>
              {intervals.map((interval, index) => (
                <AccordionItem key={interval.id} value={interval.id} className="">
                  <AccordionTrigger className="p-4 rounded-none ">
                    {interval.name || `Interval ${index + 1}`}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 flex flex-col gap-2 accordion-content-open pt-0">
                    <div>
                      <label className="text-xs">Name</label>
                      <KeyboardAwareInput 
                        placeholder="Interval name" 
                        value={interval.name}
                        onChange={(e) => updateInterval(interval.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Minutes</label>
                      <KeyboardAwareInput 
                        placeholder="minutes" 
                        type="number" 
                        value={interval.minutes || ''}
                        onChange={(e) => updateInterval(interval.id, 'minutes', e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full text-red-400" 
                      variant="outline"
                      onClick={() => removeInterval(interval.id)}
                    >
                      Remove
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="p-4">
              <Button className="w-full" variant="outline" onClick={addInterval}>
                Add Interval
              </Button>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <Button onClick={handleSubmit}>Start Timer</Button>
       
       
            <DrawerClose className="w-full">
                <Button className="w-full" variant="outline">Cancel</Button>
              </DrawerClose>
            <div className="border-t pt-4 mt-4">
              <Button 
                variant="outline" 
                className="w-full text-red-500  hover:bg-red-50" 
                onClick={clearAllData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
            </div>
         
        </DrawerContent>
      </Drawer>
    </>



  );
}

export default App;
