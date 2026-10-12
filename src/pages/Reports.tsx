import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EMOTION_COLORS } from '@/lib/mockData';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { listSessionsForUser, type SupabaseSessionWithPatient } from '@/lib/supabaseService';

const Reports = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SupabaseSessionWithPatient[]>([]);

  useEffect(() => {
    if (!user) return;
    listSessionsForUser(user.uid).then((data) => setSessions(data as SupabaseSessionWithPatient[]));
  }, [user]);

  const emotionCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const emotion = s.dominant_emotion || 'Neutral';
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });
  const pieData = Object.entries(emotionCounts).map(([name, value]) => ({ name, value }));

  const sessionsByDate = sessions.map(s => ({ date: new Date(s.date).toLocaleDateString(), grip: s.avg_grip_force || 0, duration: s.duration_seconds || 0 }));

  const handleExportAllCsv = () => {
    if (sessions.length === 0) {
      toast.info('No session data available to export');
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "RehabAI Session History Summary Export\r\n";
    csvContent += "Session ID,Date,Patient Name,Age,Gender,Diagnosis,Affected Limb,Duration (m:s),Dominant Emotion,Avg Grip Force (N),Status\r\n";
    
    sessions.forEach((s) => {
      const p = s.patient || {};
      const durationMin = Math.floor((s.duration_seconds || 0) / 60);
      const durationSec = (s.duration_seconds || 0) % 60;
      const durationStr = `${durationMin}:${String(durationSec).padStart(2, '0')}`;
      const dateStr = new Date(s.date).toLocaleDateString();
      
      csvContent += `"${s.id}","${dateStr}","${p.name || 'Unknown'}","${p.age || '—'}","${p.gender || '—'}","${p.diagnosis || '—'}","${p.affected_limb || '—'}","${durationStr}","${s.dominant_emotion || '—'}","${s.avg_grip_force ? Number(s.avg_grip_force).toFixed(1) : '—'}","${s.status || '—'}"\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RehabAI_All_Sessions_Export_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("All session records exported successfully as CSV");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground text-sm">Analytics and export options</p>
        </div>
        <Button variant="outline" onClick={handleExportAllCsv}><Download className="w-4 h-4 mr-2" />Export All CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Emotion Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={EMOTION_COLORS[entry.name as keyof typeof EMOTION_COLORS] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Grip Force by Session</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="grip" fill="hsl(var(--secondary))" name="Avg Grip (N)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
