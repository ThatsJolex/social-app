import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {

    //
    // GET FORM DATA
    //
    const formData = await req.formData()

    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    //
    // CONVERT FILE
    //
    const bytes = await file.arrayBuffer()

    const buffer = Buffer.from(bytes)

    //
    // UNIQUE FILE NAME
    //
    const fileName =
      `${uuidv4()}-${file.name}`

    //
    // SAVE PATH
    //
    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    )

    //
    // SAVE FILE
    //
    fs.writeFileSync(uploadPath, buffer)

    //
    // RETURN IMAGE URL
    //
    return NextResponse.json({
      imageUrl: `/uploads/${fileName}`,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}