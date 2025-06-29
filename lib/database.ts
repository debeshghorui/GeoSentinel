import { createClient } from './supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  organization?: string;
  role?: string;
  location?: string;
  timezone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AreaOfInterest {
  id: string;
  project_id: string;
  name: string;
  geometry: any; // GeoJSON geometry
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  project_id: string;
  area_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata?: any;
  is_read: boolean;
  created_at: string;
}

// Profile operations
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// Project operations
export async function getProjects(userId: string): Promise<Project[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function createProject(userId: string, name: string, description?: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: userId,
        name,
        description,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateProject(projectId: string, updates: Partial<Project>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  return { data, error };
}

export async function deleteProject(projectId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  return { error };
}

// Area of Interest operations
export async function getAreasOfInterest(projectId: string): Promise<AreaOfInterest[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('areas_of_interest')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching areas of interest:', error);
    return [];
  }

  return data || [];
}

export async function createAreaOfInterest(
  projectId: string,
  name: string,
  geometry: any
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('areas_of_interest')
    .insert([
      {
        project_id: projectId,
        name,
        geometry,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateAreaOfInterest(
  areaId: string,
  updates: Partial<AreaOfInterest>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('areas_of_interest')
    .update(updates)
    .eq('id', areaId)
    .select()
    .single();

  return { data, error };
}

export async function deleteAreaOfInterest(areaId: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('areas_of_interest')
    .delete()
    .eq('id', areaId);

  return { error };
}

// Alert operations
export async function getAlerts(projectId: string): Promise<Alert[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return data || [];
}

export async function getUnreadAlertsCount(projectId: string): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('is_read', false);

  if (error) {
    console.error('Error counting unread alerts:', error);
    return 0;
  }

  return count || 0;
}

export async function markAlertAsRead(alertId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('id', alertId)
    .select()
    .single();

  return { data, error };
}

export async function createAlert(
  projectId: string,
  areaId: string,
  alertType: string,
  severity: Alert['severity'],
  message: string,
  metadata?: any
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('alerts')
    .insert([
      {
        project_id: projectId,
        area_id: areaId,
        alert_type: alertType,
        severity,
        message,
        metadata,
      },
    ])
    .select()
    .single();

  return { data, error };
} 