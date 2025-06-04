import { NextResponse } from "next/server";

export async function GET() {
  const vars = {
    BASE_URL: process.env.BASE_URL || "undefined",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "undefined",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT_SET",
    NODE_ENV: process.env.NODE_ENV || "undefined",
    PORT: process.env.PORT || "undefined",
  };

  console.log("=== VARS TEST ===");
  console.log(vars);

  return NextResponse.json({
    status: "ok",
    variables: vars,
    allEnvKeys: Object.keys(process.env).filter(
      (key) =>
        key.includes("NEXTAUTH") ||
        key.includes("BASE_URL") ||
        key.includes("PORT")
    ),
  });
}
