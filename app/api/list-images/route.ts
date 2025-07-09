import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dir = searchParams.get("dir");
  if (!dir) {
    return NextResponse.json({ error: "No dir specified" }, { status: 400 });
  }
  const imagesDir = path.join(process.cwd(), "public", dir);
  try {
    const files = await readdir(imagesDir);
    const imageFiles = files
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return NextResponse.json({ files: imageFiles.map(f => `${dir}/${f}`) });
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
} 