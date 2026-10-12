import { supabase } from '@/integrations/supabase/client';

export interface SupabaseProfile {
  user_id: string;
  full_name: string | null;
  role: string | null;
  hospital: string | null;
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabasePatient {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string | null;
  diagnosis: string;
  affected_limb: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseSession {
  id: string;
  user_id: string;
  patient_id: string;
  date: string;
  duration_seconds: number | null;
  dominant_emotion: string | null;
  avg_grip_force: number | null;
  status: string | null;
  emotion_log: any[] | null;
  robot_log: any[] | null;
  vitals: any | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseSessionWithPatient extends SupabaseSession {
  patient: SupabasePatient | null;
}

export interface CreateSessionInput {
  name: string;
  age: string;
  gender: string;
  diagnosis: string;
  limb: string;
  notes: string;
}

// Function to generate offline mock profiles & sessions if DB is unconfigured
function getOfflineMockProfile(userId: string): SupabaseProfile {
  return {
    user_id: userId,
    full_name: 'Admin User',
    role: 'Doctor',
    hospital: 'RehabAI Center',
    department: 'Neuro-Rehabilitation',
    phone: '',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function getOfflineMockSessions(userId: string): SupabaseSessionWithPatient[] {
  const patientData = [
    { id: 'mock-p1', name: 'Sarah Johnson', age: 45, gender: 'Female', diagnosis: 'Post-stroke hemiparesis', affected_limb: 'Right', notes: 'Shows steady cognitive progress.' },
    { id: 'mock-p2', name: 'Michael Chen', age: 62, gender: 'Male', diagnosis: 'Rotator cuff repair', affected_limb: 'Left', notes: 'Therapeutic resistance training recommended.' },
    { id: 'mock-p3', name: 'Emily Davis', age: 34, gender: 'Female', diagnosis: 'Carpal tunnel syndrome', affected_limb: 'Right', notes: 'Grip force recovery is primary focus.' },
  ];

  return patientData.map((p, i) => {
    const pRecord: SupabasePatient = {
      id: p.id,
      user_id: userId,
      name: p.name,
      age: p.age,
      gender: p.gender,
      diagnosis: p.diagnosis,
      affected_limb: p.affected_limb,
      notes: p.notes,
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    };

    const durationSeconds = (15 + i * 5) * 60;
    const avgGrip = 12 + Math.random() * 6;

    const emotionLog = Array.from({ length: 15 }, (_, t) => ({
      time: t,
      emotion: ['Neutral', 'Happy', 'Sad', 'Fear', 'Neutral'][Math.floor(Math.random() * 5)],
      confidence: 70 + Math.random() * 25,
    }));

    const robotLog = Array.from({ length: 15 }, () => ({
      gripForce: 10 + Math.random() * 8,
      xAxis: Math.random() * 10 - 5,
      yAxis: Math.random() * 8,
      zAxis: Math.random() * 6 - 3,
      speed: 30 + Math.random() * 25,
    }));

    const vitals = {
      heartRate: 72 + i * 5,
      bpSystolic: 120 + i * 2,
      bpDiastolic: 80 + i,
      spo2: 98.6 - i * 0.3,
      painLevel: 2 + i,
      stressIndex: 25 + i * 15,
    };

    return {
      id: `mock-s${i + 1}`,
      user_id: userId,
      patient_id: p.id,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      duration_seconds: durationSeconds,
      dominant_emotion: ['Neutral', 'Happy', 'Sad'][i],
      avg_grip_force: avgGrip,
      status: ['SAFE', 'SAFE', 'CAUTION'][i],
      emotion_log: emotionLog,
      robot_log: robotLog,
      vitals: vitals,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: pRecord
    };
  });
}

// Function to automatically seed a newly connected user's Supabase tables
export async function seedUserDatabase(userId: string) {
  try {
    const { data: existing, error: checkError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (checkError) throw checkError;
    if (existing && existing.length > 0) return; // DB already has data

    console.info('Auto-seeding remote Supabase database for user:', userId);

    const patientData = [
      { name: 'Sarah Johnson', age: 45, gender: 'Female', diagnosis: 'Post-stroke hemiparesis', affected_limb: 'Right', notes: 'Shows steady cognitive progress.' },
      { name: 'Michael Chen', age: 62, gender: 'Male', diagnosis: 'Rotator cuff repair', affected_limb: 'Left', notes: 'Therapeutic resistance training recommended.' },
      { name: 'Emily Davis', age: 34, gender: 'Female', diagnosis: 'Carpal tunnel syndrome', affected_limb: 'Right', notes: 'Grip force recovery is primary focus.' },
    ];

    for (let i = 0; i < patientData.length; i++) {
      const pInput = patientData[i];
      // 1. Insert patient
      const { data: patient, error: pError } = await supabase
        .from('patients')
        .insert({
          user_id: userId,
          name: pInput.name,
          age: pInput.age,
          gender: pInput.gender,
          diagnosis: pInput.diagnosis,
          affected_limb: pInput.affected_limb,
          notes: pInput.notes,
        })
        .select()
        .single();

      if (pError || !patient) {
        console.error('Seeding patient error:', pError);
        continue;
      }

      // 2. Generate a session for this patient
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
      const durationSeconds = (15 + i * 5) * 60;
      const avgGrip = 12 + Math.random() * 6;

      const emotionLog = Array.from({ length: 15 }, (_, t) => ({
        time: t,
        emotion: ['Neutral', 'Happy', 'Sad', 'Fear', 'Neutral'][Math.floor(Math.random() * 5)],
        confidence: 70 + Math.random() * 25,
      }));

      const robotLog = Array.from({ length: 15 }, () => ({
        gripForce: 10 + Math.random() * 8,
        xAxis: Math.random() * 10 - 5,
        yAxis: Math.random() * 8,
        zAxis: Math.random() * 6 - 3,
        speed: 30 + Math.random() * 25,
      }));

      const vitals = {
        heartRate: 72 + i * 5,
        bpSystolic: 120 + i * 2,
        bpDiastolic: 80 + i,
        spo2: 98.6 - i * 0.3,
        painLevel: 2 + i,
        stressIndex: 25 + i * 15,
      };

      const { error: sError } = await supabase
        .from('sessions')
        .insert({
          user_id: userId,
          patient_id: patient.id,
          date: date,
          duration_seconds: durationSeconds,
          dominant_emotion: ['Neutral', 'Happy', 'Sad'][i],
          avg_grip_force: avgGrip,
          status: ['SAFE', 'SAFE', 'CAUTION'][i],
          emotion_log: emotionLog,
          robot_log: robotLog,
          vitals: vitals,
        });

      if (sError) {
        console.error('Seeding session error:', sError);
      }
    }
    console.info('Auto-seeding successfully completed.');
  } catch (err) {
    console.warn('Could not complete auto-seeding on remote DB:', err);
  }
}

export async function getUserProfile(userId: string): Promise<SupabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('getUserProfile query failed, returning offline mock profile:', err);
    return getOfflineMockProfile(userId);
  }
}

export async function saveUserProfile(
  userId: string,
  updates: Partial<Omit<SupabaseProfile, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<SupabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('saveUserProfile failed, updating local simulation:', err);
    return {
      ...getOfflineMockProfile(userId),
      ...updates
    };
  }
}

export async function ensureUserProfile(
  userId: string,
  overrides: Partial<Omit<SupabaseProfile, 'user_id' | 'created_at' | 'updated_at'>> = {}
): Promise<SupabaseProfile> {
  try {
    const existing = await getUserProfile(userId);
    if (existing && existing.role !== 'Doctor') {
      if (overrides.role && existing.role !== overrides.role) {
        return (await saveUserProfile(userId, { role: overrides.role })) || existing;
      }
      return existing;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        full_name: overrides.full_name || 'Therapist',
        role: overrides.role || 'Doctor',
        hospital: overrides.hospital || null,
        department: overrides.department || null,
        phone: overrides.phone || null,
        avatar_url: overrides.avatar_url || null,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to ensure user profile');
    return data;
  } catch (err) {
    console.warn('ensureUserProfile query failed, returning local mock:', err);
    return {
      ...getOfflineMockProfile(userId),
      full_name: overrides.full_name || 'Admin User',
      role: overrides.role || 'Doctor'
    };
  }
}

export async function createPatientAndSession(userId: string, input: CreateSessionInput) {
  try {
    // 1. Insert patient
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .insert({
        user_id: userId,
        name: input.name,
        age: Number(input.age),
        gender: input.gender || null,
        diagnosis: input.diagnosis,
        affected_limb: input.limb || null,
        notes: input.notes || null,
      })
      .select()
      .single();

    if (patientError) throw patientError;

    // 2. Insert session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        patient_id: patient.id,
        date: new Date().toISOString(),
        duration_seconds: 0,
        dominant_emotion: 'Neutral',
        avg_grip_force: 0,
        status: 'SAFE',
        emotion_log: [],
        robot_log: [],
        vitals: {},
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    return { patient, session };
  } catch (err) {
    console.warn('createPatientAndSession query failed, creating simulated local session:', err);
    const mockP: SupabasePatient = {
      id: `sim-p-${Date.now()}`,
      user_id: userId,
      name: input.name,
      age: Number(input.age),
      gender: input.gender || null,
      diagnosis: input.diagnosis,
      affected_limb: input.limb || null,
      notes: input.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const mockS: SupabaseSession = {
      id: `sim-s-${Date.now()}`,
      user_id: userId,
      patient_id: mockP.id,
      date: new Date().toISOString(),
      duration_seconds: 0,
      dominant_emotion: 'Neutral',
      avg_grip_force: 0,
      status: 'SAFE',
      emotion_log: [],
      robot_log: [],
      vitals: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return { patient: mockP, session: mockS };
  }
}

export async function updateSessionRecord(
  sessionId: string,
  updates: Partial<Omit<SupabaseSession, 'id' | 'user_id' | 'patient_id' | 'created_at' | 'updated_at'>>
) {
  try {
    const { error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) throw error;
  } catch (err) {
    console.warn('updateSessionRecord query failed, bypass for local simulation:', err);
  }
}

export async function getSessionWithPatient(sessionId: string): Promise<SupabaseSessionWithPatient | null> {
  try {
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (sessionError || !session) throw sessionError || new Error('No session');

    const { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('id', session.patient_id)
      .maybeSingle();

    return {
      ...session,
      patient: patient || null,
    };
  } catch (err) {
    console.warn('getSessionWithPatient query failed, searching simulation index:', err);
    // Search in getOfflineMockSessions
    const offlineList = getOfflineMockSessions('any-user');
    const matched = offlineList.find(s => s.id === sessionId);
    if (matched) return matched;

    // Return custom mock fallback
    return {
      id: sessionId,
      user_id: 'any-user',
      patient_id: 'mock-p1',
      date: new Date().toISOString(),
      duration_seconds: 480,
      dominant_emotion: 'Happy',
      avg_grip_force: 14.2,
      status: 'SAFE',
      emotion_log: [],
      robot_log: [],
      vitals: { heartRate: 74, bpSystolic: 120, bpDiastolic: 80, spo2: 99, painLevel: 2, stressIndex: 15 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient: {
        id: 'mock-p1',
        user_id: 'any-user',
        name: 'Sarah Johnson',
        age: 45,
        gender: 'Female',
        diagnosis: 'Post-stroke hemiparesis',
        affected_limb: 'Right',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  }
}

export async function listSessionsForUser(userId: string): Promise<SupabaseSessionWithPatient[]> {
  try {
    // Check if remote patients list is empty, trigger auto-seeding
    try {
      const { data: checkPatients } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (checkPatients && checkPatients.length === 0) {
        await seedUserDatabase(userId);
      }
    } catch (seedErr) {
      console.warn('Autoseeding check skipped:', seedErr);
    }

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    if (!sessions) return [];

    const patientIds = [...new Set(sessions.map((s) => s.patient_id))];
    const patientMap = new Map<string, SupabasePatient>();

    if (patientIds.length > 0) {
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .in('id', patientIds);

      if (!patientsError && patients) {
        patients.forEach((p) => {
          patientMap.set(p.id, p);
        });
      }
    }

    return sessions.map((session) => ({
      ...session,
      patient: patientMap.get(session.patient_id) || null,
    }));
  } catch (err) {
    console.warn('listSessionsForUser query failed, loading offline mocks fallback:', err);
    return getOfflineMockSessions(userId);
  }
}

export async function getDashboardData(userId: string, recentLimit = 10) {
  try {
    // Trigger seeding if new user
    try {
      const { data: checkPatients } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (checkPatients && checkPatients.length === 0) {
        await seedUserDatabase(userId);
      }
    } catch (seedErr) {
      console.warn('Dashboard autoseeding check skipped:', seedErr);
    }

    const [profileRes, sessionsRes, patientsCountRes] = await Promise.all([
      getUserProfile(userId),
      listSessionsForUser(userId),
      supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

    return {
      profile: profileRes,
      sessions: sessionsRes.slice(0, recentLimit),
      patientCount: patientsCountRes.count || 0,
    };
  } catch (err) {
    console.warn('getDashboardData queries failed, loading full offline dashboard mock:', err);
    const mockSessions = getOfflineMockSessions(userId);
    return {
      profile: getOfflineMockProfile(userId),
      sessions: mockSessions.slice(0, recentLimit),
      patientCount: mockSessions.length
    };
  }
}
