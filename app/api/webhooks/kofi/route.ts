import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use SERVICE_ROLE_KEY here because we are updating the DB on the backend
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = JSON.parse(formData.get("data") as string);

    // 1. Verify this is a real payment (check Ko-fi verification token)
    if (data.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Only process if it's a "Donation" or "Shop Order"
    if (data.type === "Donation" || data.type === "Shop Order") {
      const email = data.email;
      const amount = parseFloat(data.amount);

      // 3. Logic: If they paid $10, give them 20 credits
      if (amount >= 10) {
        // Fetch current credits
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("credits")
          .eq("email", email)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({ credits: profile.credits + 20 })
            .eq("email", email);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
