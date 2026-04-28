"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData, locale: string) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/${locale}/cars`);
}

export async function register(formData: FormData, locale: string) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        is_owner: role === "owner",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/${locale}/cars`);
}

export async function logout(locale: string) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}
