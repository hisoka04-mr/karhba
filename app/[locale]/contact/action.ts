"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactForm(formData: FormData) {
  const supabase = createClient();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All fields are required" };
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, subject, message }]);

  if (error) {
    console.error("Error submitting contact form:", error);
    return { error: error.message };
  }

  return { success: true };
}
