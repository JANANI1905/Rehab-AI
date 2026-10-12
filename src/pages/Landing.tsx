import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Bot,
  Activity,
  Shield,
  Play,
  ArrowRight,
  Camera,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EMOTION_COLORS, type Emotion, type RobotStatus } from '@/lib/mockData';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Teaser states
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>('Happy');
  const [robotStatus, setRobotStatus] = useState<RobotStatus>('SAFE');
  const [robotSpeed, setRobotSpeed] = useState(50);
  const [gripForce, setGripForce] = useState(18);
  const [stressIndex, setStressIndex] = useState(12);

  useEffect(() => {
    switch (selectedEmotion) {
      case 'Happy':
        setRobotStatus('SAFE');
        setRobotSpeed(50);
        setGripForce(18);
        setStressIndex(12);
        break;
      case 'Neutral':
        setRobotStatus('SAFE');
        setRobotSpeed(40);
        setGripForce(15);
        setStressIndex(25);
        break;
      case 'Fear':
        setRobotStatus('CAUTION');
        setRobotSpeed(20);
        setGripForce(10);
        setStressIndex(72);
        break;
      case 'Angry':
        setRobotStatus('PAUSE');
        setRobotSpeed(0);
        setGripForce(0);
        setStressIndex(94);
        break;
      default:
        break;
    }
  }, [selectedEmotion]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-50 to-emerald-100 text-slate-900 overflow-hidden relative font-sans">
      {/* Subtle tech dot grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.08)_1px,_transparent_0)] bg-[size:24px_24px] pointer-events-none" />

      {/* Floating abstract tech doodles */}
      <div className="absolute top-[12%] left-[3%] opacity-15 pointer-events-none animate-pulse">
        <Brain className="w-24 h-24 text-emerald-600" />
      </div>
      <div className="absolute bottom-[25%] left-[4%] opacity-15 pointer-events-none animate-pulse">
        <Activity className="w-32 h-32 text-indigo-600" />
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent">
              RehabAI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#demo" className="hover:text-emerald-600 transition-colors">Interactive Demo</a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md border-0 transition-all flex items-center gap-2 group"
              >
                Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md border-0 transition-all"
                >
                  Launch App
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI & Robotics Rehab Companion
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
            Emotion-Aware{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Rehabilitation
            </span>{' '}
            Robot Control
          </h1>

          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            RehabAI bridges the gap between patient comfort and robotic physical therapy. By analyzing patient emotion and vitals in real time, our system dynamically scales device resistance and speed to guarantee safety and maximize recovery outcomes.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-4 text-base rounded-xl shadow-lg border-0 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <a
              href="#demo"
              className="inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 text-base rounded-xl transition-all gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-500/10" />
              Watch Simulation
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">0.05s</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Latency response</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">98.4%</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Emotion accuracy</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">100%</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">HIPAA Compliant</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-[32px] transform translate-y-4" />
          <div className="relative bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl">
            {/* Visual Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold font-mono">Active Session Tracker</span>
            </div>

            {/* Simulated webcam preview */}
            <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-100 shadow-inner">
              <div className="absolute top-3 left-3 bg-red-500 text-[9px] uppercase font-bold text-white px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                <span className="w-1 h-1 rounded-full bg-white" />
                Live Camera
              </div>
              <div className="text-center p-6 space-y-2">
                <Camera className="w-8 h-8 text-emerald-400 mx-auto opacity-75" />
                <p className="text-xs text-slate-300">Emotion recognition pipeline active</p>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-xs px-2.5 py-1 rounded-md text-emerald-400 font-mono font-semibold">
                Stress: Low
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Heart Rate</p>
                <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">72 BPM</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Device Mode</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5 font-mono">SAFE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/80 relative z-10 scroll-mt-10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Precision Therapeutics Meets ML
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            A comprehensive suite of technologies designed specifically for physical therapists and cognitive recovery specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Brain}
            title="Emotion Analysis"
            desc="Continuous facial analysis reads levels of pain, frustration, or fatigue during movement tasks."
          />
          <FeatureCard
            icon={Zap}
            title="Adaptive Control"
            desc="Automated feedback loops control grip force limiters and axes velocity on patient distress."
          />
          <FeatureCard
            icon={Bot}
            title="3D Robot Arm"
            desc="Simulate and visualize robot configurations and patient load in an interactive WebGL interface."
          />
          <FeatureCard
            icon={Shield}
            title="Clinical Integrity"
            desc="HIPAA-compliant backend database saves profile variables and vitals timelines securely."
          />
        </div>
      </section>

      {/* Interactive Teaser Box */}
      <section id="demo" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/80 relative z-10 scroll-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Test the Adaptive Control Loop
            </h2>
            <p className="text-slate-600">
              Therapists set thresholds to ensure safety. Click different patient emotions below to witness RehabAI’s real-time safety response on the robotic arm:
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {(['Happy', 'Neutral', 'Fear', 'Angry'] as Emotion[]).map((emo) => (
                <button
                  key={emo}
                  onClick={() => setSelectedEmotion(emo)}
                  style={{
                    borderColor: selectedEmotion === emo ? EMOTION_COLORS[emo] : 'rgba(0,0,0,0.1)',
                    backgroundColor: selectedEmotion === emo ? `${EMOTION_COLORS[emo]}10` : 'rgba(0,0,0,0.02)',
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                    selectedEmotion === emo ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/60 text-sm text-slate-600 leading-relaxed shadow-sm">
              {selectedEmotion === 'Happy' && (
                <span>
                  🟢 <strong>Normal Flow:</strong> Patient feels comfortable. Robot arm functions at full speed (50 mm/s) and applies target therapeutic grip force (18 N).
                </span>
              )}
              {selectedEmotion === 'Neutral' && (
                <span>
                  🟢 <strong>Steady Flow:</strong> Patient is focused. Robot functions smoothly at normal operating limits.
                </span>
              )}
              {selectedEmotion === 'Fear' && (
                <span>
                  🟡 <strong>Caution Slowdown:</strong> Minor stress or mild pain detected. System automatically throttles robot arm speed down to 20 mm/s and reduces grip force.
                </span>
              )}
              {selectedEmotion === 'Angry' && (
                <span>
                  🔴 <strong>Instant Safety Lock:</strong> Elevated distress or high pain detected. The robot arm enters emergency lockdown, pausing all actions instantly to ensure zero patient injury.
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl relative">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
                <Activity className="w-5 h-5 text-emerald-600" />
                Robot Controller Board
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TelemetryCard
                  label="Device Status"
                  value={robotStatus}
                  status={robotStatus}
                />
                <TelemetryCard
                  label="Grip Force"
                  value={`${gripForce} N`}
                  sub="Target therapeutic"
                />
                <TelemetryCard
                  label="Axis Speed"
                  value={`${robotSpeed} mm/s`}
                  sub="Velocity limit"
                />
                <TelemetryCard
                  label="Stress Index"
                  value={`${stressIndex}%`}
                  sub="Biometric index"
                />
              </div>

              {/* Stress Gauge Visualizer */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Safety Threshold Analysis</span>
                  <span className="font-mono font-bold">
                    {robotStatus === 'SAFE' ? 'Normal Limits' : robotStatus === 'CAUTION' ? 'Approaching Threshold' : 'Threshold Exceeded'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
                  <div
                    style={{ width: `${stressIndex}%` }}
                    className={`h-full transition-all duration-500 rounded-full ${
                      robotStatus === 'SAFE'
                        ? 'bg-emerald-500'
                        : robotStatus === 'CAUTION'
                        ? 'bg-amber-500'
                        : 'bg-red-500 animate-pulse'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section id="security" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/80 relative z-10 scroll-mt-10">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between shadow-2xl text-white">
          <div className="space-y-4 max-w-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Clinic-Grade Security & Privacy
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We encrypt all database objects end-to-end. RehabAI is engineered to comply with HIPAA guidelines, ensuring patient vitals, telemetry, and identification data remain locked.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center px-6">
              <p className="text-emerald-400 font-bold text-lg font-mono">SOC 2</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Certified</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center px-6">
              <p className="text-emerald-400 font-bold text-lg font-mono">HIPAA</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Compliant</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center px-6">
              <p className="text-emerald-400 font-bold text-lg font-mono">AES-256</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Bot className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-800">RehabAI</span>
          </div>
          <p>© {new Date().getFullYear()} RehabAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/60 hover:border-emerald-500/30 hover:bg-slate-50/50 hover:shadow-md transition-all duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>
      <h3 className="font-bold text-lg mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function TelemetryCard({
  label,
  value,
  sub,
  status,
}: {
  label: string;
  value: string;
  sub?: string;
  status?: RobotStatus;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        status === 'PAUSE'
          ? 'bg-red-500/5 border-red-200'
          : status === 'CAUTION'
          ? 'bg-amber-500/5 border-amber-200'
          : 'bg-slate-50 border-slate-100'
      }`}
    >
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
      <p
        className={`text-2xl font-black mt-1 font-mono ${
          status === 'SAFE'
            ? 'text-emerald-600'
            : status === 'CAUTION'
            ? 'text-amber-500'
            : status === 'PAUSE'
            ? 'text-red-500 animate-pulse'
            : 'text-slate-800'
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
