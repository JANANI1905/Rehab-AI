import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Shield, ArrowLeft, Mail, Lock, User, ArrowRight, Activity, Heart, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Doctor');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !fullName)) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Signed in successfully');
        navigate('/dashboard');
      } else {
        await signUp(email, password, fullName, role);
        toast.success('Account created! Welcome to RehabAI');
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-mono">
        Loading Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-50 to-emerald-100 p-4 relative overflow-hidden font-sans">
      {/* Subtle tech dot grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(16,185,129,0.08)_1px,_transparent_0)] bg-[size:24px_24px] pointer-events-none" />

      {/* Floating abstract tech doodles */}
      <div className="absolute top-[10%] left-[8%] opacity-15 pointer-events-none animate-pulse">
        <Brain className="w-28 h-28 text-emerald-600" />
      </div>
      <div className="absolute bottom-[10%] right-[8%] opacity-15 pointer-events-none animate-pulse">
        <Activity className="w-36 h-36 text-indigo-600" />
      </div>
      <div className="absolute top-[60%] left-[5%] opacity-10 pointer-events-none">
        <Heart className="w-20 h-20 text-red-500" />
      </div>

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white/70 border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm backdrop-blur-md"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-4">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">RehabAI Platform</h1>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Adaptive Control Panel & Emotion Analytics</p>
        </div>

        <Card className="bg-white/80 border border-slate-200/80 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl border border-slate-200/30">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setEmail('');
                  setPassword('');
                }}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                  isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${
                  !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-xs font-bold">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sarah Chen"
                        className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 pl-9 rounded-xl focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-xs font-bold">Clinical Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="bg-white border-slate-200 text-slate-800 rounded-xl focus:ring-emerald-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-800">
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Therapist">Therapist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label className="text-slate-700 text-xs font-bold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="therapist@hospital.com"
                    className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 pl-9 rounded-xl focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 text-xs font-bold">Secure Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 pl-9 rounded-xl focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 rounded-xl border-0 shadow-md flex items-center justify-center gap-2 group transition-all mt-6"
              >
                <Shield className="w-4 h-4" />
                {submitting ? 'Authenticating...' : isLogin ? 'Access System' : 'Create Account'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          SOC 2 Certified • HIPAA Compliant • AES-256 Encrypted
        </p>
      </div>
    </div>
  );
}
