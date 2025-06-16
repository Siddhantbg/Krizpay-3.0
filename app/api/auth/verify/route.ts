import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get user data
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
      }
    });

  } catch (error: any) {
    console.error('Token verification error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return NextResponse.json(
        { error: 'Token revoked' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

// Rate limiting for auth endpoints
const rateLimitMap = new Map();

export async function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // Max 10 requests per window

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const userData = rateLimitMap.get(ip);
    
    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + windowMs;
    } else {
      userData.count++;
      
      if (userData.count > maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
    }
  }

  return NextResponse.next();
}