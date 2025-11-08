import { NextRequest, NextResponse } from "next/server";
import { getPool, initDatabase } from "@/lib/db";

// Initialize database on first import
let dbInitialized = false;
async function ensureDatabase() {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabase();
    const pool = getPool();
    const body = await request.json();
    
    // Generate unique submission ID
    const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const submittedAt = new Date().toISOString();
    
    // Extract pricing if it exists
    const { pricing, ...formData } = body;
    
    // Insert into database
    await pool.query(
      `INSERT INTO submissions (submission_id, company_name, contact_name, email, phone, submitted_at, data, pricing)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        submissionId,
        formData.companyName || '',
        formData.contactName || '',
        formData.email || '',
        formData.phone || '',
        submittedAt,
        JSON.stringify(formData),
        pricing ? JSON.stringify(pricing) : null,
      ]
    );
    
    return NextResponse.json(
      {
        success: true,
        message: "Submission saved successfully",
        id: submissionId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving submission:", error);
    
    // Provide helpful error messages
    let errorMessage = "Failed to save submission";
    if (error.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to database. Please check your database host and credentials in .env.local file.";
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = "Database access denied. Please check your username and password.";
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = "Database not found. Please check your database name.";
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication
    const authHeader = request.headers.get("authorization");
    const isAuthorized = authHeader === `Bearer ${process.env.ADMIN_SECRET || "admin-secret-key"}`;
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Please provide valid authorization token." },
        { status: 401 }
      );
    }
    
    await ensureDatabase();
    const pool = getPool();
    
    // Fetch all submissions from database, most recent first
    const [rows] = await pool.query(
      `SELECT 
        id,
        submission_id,
        company_name,
        contact_name,
        email,
        phone,
        submitted_at,
        data,
        pricing,
        created_at
       FROM submissions 
       ORDER BY submitted_at DESC`
    ) as any;
    
    // Parse JSON fields
    const submissions = rows.map((row: any) => ({
      id: row.submission_id,
      companyName: row.company_name,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      submittedAt: row.submitted_at,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      pricing: row.pricing ? (typeof row.pricing === 'string' ? JSON.parse(row.pricing) : row.pricing) : null,
      createdAt: row.created_at,
    }));
    
    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions: submissions,
    });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch submissions",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


