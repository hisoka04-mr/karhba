import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/en/auth/complete-profile";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if user has completed their profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, driving_experience, age")
          .eq("id", user.id)
          .single();

        // If profile is incomplete, redirect to complete-profile
        if (!profile?.full_name || !profile?.driving_experience || !profile?.age) {
          // Extract locale from the next URL or default to 'en'
          const pathParts = next.split('/');
          const locale = pathParts[1] || 'en';
          return NextResponse.redirect(`${origin}/${locale}/auth/complete-profile`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/en/auth/login?error=auth_callback_error`);
}
