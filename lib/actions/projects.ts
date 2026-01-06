"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectStatus } from "@/lib/types/crm";

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  const supabase = await createClient();

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
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select(`
      *,
      contact:contacts(*)
    `)
    .order("created_at", { ascending: false });

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      contact:contacts(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

export async function getProjectActivity(projectId: string) {
  const supabase = await createClient();

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
  const supabase = await createClient();

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
