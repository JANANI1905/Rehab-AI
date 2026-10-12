const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://qcfmssofqothromfwcjo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZm1zc29mcW90aHJvbWZ3Y2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjMzOTIsImV4cCI6MjA5MDQzOTM5Mn0.k3S7Y_krn9w3LZAWSuX0T6wO7QfTBZPtc6-5eHYfv0M";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const email = "admin@rehabai.local";
const password = "RehabAI@Admin#2026!";

async function runSeed() {
  console.log("Starting remote database seed script from project root...");
  
  let userId;
  
  // 1. Try to register the admin user
  console.log(`Checking/Registering admin account: ${email}...`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: "Admin User",
        role: "Doctor"
      }
    }
  });
  
  if (signUpError) {
    console.log("Sign up failed. Error details:", signUpError.message, signUpError.status);
    console.log("Attempting to sign in with password...");
    // 2. Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) {
      console.error("Sign in failed. Error details:", signInError.message, signInError.status);
      process.exit(1);
    }
    userId = signInData.user.id;
    console.log("Successfully authenticated admin user. ID:", userId);
  } else {
    userId = signUpData.user.id;
    console.log("Successfully registered new admin user. ID:", userId);
  }
  
  // 3. Ensure profile exists
  console.log("Checking profiles table...");
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
    
  if (profileErr) {
    console.error("ERROR: Profiles table check failed. Did you run the migrations in Supabase SQL editor?", profileErr.message);
    process.exit(1);
  }
  
  if (!profile) {
    console.log("Inserting admin profile record...");
    const { error: insertProfErr } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        full_name: "Admin User",
        role: "Doctor",
        hospital: "RehabAI Center",
        department: "Neuro-Rehabilitation"
      });
      
    if (insertProfErr) {
      console.warn("Could not insert profile:", insertProfErr.message);
    }
  } else {
    console.log("Admin profile already exists.");
  }
  
  // 4. Check if patients already exist
  console.log("Checking if patients already exist...");
  const { data: existingPatients, error: checkError } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
    
  if (checkError) {
    console.error("ERROR: Patients table query failed. Did you run the migrations?", checkError.message);
    process.exit(1);
  }
  
  if (existingPatients && existingPatients.length > 0) {
    console.log("Database already seeded with patients. Exiting successfully.");
    process.exit(0);
  }
  
  // 5. Seed Patients and Sessions
  console.log("Seeding mock patients and sessions...");
  
  const patientData = [
    { name: 'Sarah Johnson', age: 45, gender: 'Female', diagnosis: 'Post-stroke hemiparesis', affected_limb: 'Right', notes: 'Shows steady cognitive progress.' },
    { name: 'Michael Chen', age: 62, gender: 'Male', diagnosis: 'Rotator cuff repair', affected_limb: 'Left', notes: 'Therapeutic resistance training recommended.' },
    { name: 'Emily Davis', age: 34, gender: 'Female', diagnosis: 'Carpal tunnel syndrome', affected_limb: 'Right', notes: 'Grip force recovery is primary focus.' },
  ];
  
  for (let i = 0; i < patientData.length; i++) {
    const pInput = patientData[i];
    console.log(`Inserting patient: ${pInput.name}...`);
    
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
      console.error(`Error inserting patient ${pInput.name}:`, pError ? pError.message : 'No patient returned');
      continue;
    }
    
    // Generate session
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
    
    console.log(`Inserting session log for patient ${pInput.name}...`);
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
      console.error(`Error inserting session for patient ${pInput.name}:`, sError.message);
    }
  }
  
  console.log("Remote database seeding completed successfully!");
}

runSeed().catch(err => {
  console.error("Unhandled error during seeding:", err);
  process.exit(1);
});
