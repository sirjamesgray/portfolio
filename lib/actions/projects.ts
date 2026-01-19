"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/constants";
import type { ProjectStatus } from "@/lib/types/crm";

// Helper to verify user is authenticated and optionally admin
async function verifyAuth(requireAdmin = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, user: null, supabase, isUserAdmin: false };
  }

  const isUserAdmin = isAdmin(user.email);

  if (requireAdmin && !isUserAdmin) {
    return { authorized: false, user, supabase, isUserAdmin };
  }

  return { authorized: true, user, supabase, isUserAdmin };
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const { authorized, supabase } = await verifyAuth(true); // Admin only

  if (!authorized) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: error.message };
  }

  // Log the activity
  await supabase.from("activity_log").insert({
    project_id: projectId,
    action: "status_changed",
    details: { new_status: status },
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);

  return { success: true };
}

export async function updateProjectNotes(projectId: string, notes: string) {
  const { authorized, supabase } = await verifyAuth(true); // Admin only

  if (!authorized) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("projects")
    .update({ notes })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating project notes:", error);
    return { success: false, error: error.message };
  }

  // Log the activity
  await supabase.from("activity_log").insert({
    project_id: projectId,
    action: "notes_updated",
    details: { notes_length: notes.length },
  });

  revalidatePath(`/admin/projects/${projectId}`);

  return { success: true };
}

export async function getProjectStats() {
  const { authorized, supabase } = await verifyAuth(true); // Admin only

  if (!authorized) {
    return {
      total: 0,
      lead: 0,
      contacted: 0,
      in_progress: 0,
      completed: 0,
      canceled: 0,
    };
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("status");

  if (error) {
    console.error("Error fetching project stats:", error);
    return {
      total: 0,
      lead: 0,
      contacted: 0,
      in_progress: 0,
      completed: 0,
      canceled: 0,
    };
  }

  const stats = {
    total: projects.length,
    lead: projects.filter((p) => p.status === "lead").length,
    contacted: projects.filter((p) => p.status === "contacted").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    canceled: projects.filter((p) => p.status === "canceled").length,
  };

  return stats;
}

export async function getProjects(status?: ProjectStatus) {
  const { authorized, supabase, user, isUserAdmin } = await verifyAuth();

  if (!authorized || !user) {
    return [];
  }

  let query = supabase
    .from("projects")
    .select(`
      *,
      contact:contacts(*)
    `)
    .order("created_at", { ascending: false });

  // Non-admins can only see their own projects
  if (!isUserAdmin) {
    query = query.eq("user_id", user.id);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data;
}

export async function getProject(id: string) {
  const { authorized, supabase, user, isUserAdmin } = await verifyAuth();

  if (!authorized || !user) {
    return null;
  }

  let query = supabase
    .from("projects")
    .select(`
      *,
      contact:contacts(*)
    `)
    .eq("id", id);

  // Non-admins can only see their own projects
  if (!isUserAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

export async function getProjectActivity(projectId: string) {
  const { authorized, supabase, user, isUserAdmin } = await verifyAuth();

  if (!authorized || !user) {
    return [];
  }

  // First verify user has access to this project
  if (!isUserAdmin) {
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return []; // User doesn't own this project
    }
  }

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activity:", error);
    return [];
  }

  return data;
}

export async function getRecentActivity(limit = 10) {
  const { authorized, supabase } = await verifyAuth(true); // Admin only

  if (!authorized) {
    return [];
  }

  const { data, error } = await supabase
    .from("activity_log")
    .select(`
      *,
      project:projects(
        *,
        contact:contacts(*)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }

  return data;
}
