import dotenv from 'dotenv';
import User, { IUser } from "../models/user.model"; 
import jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';


export const refreshTokens = new Set<string>();

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

export const authenticateUser = async (email: string, inputPassword: string) => {
  try {
    console.log('[Auth] Starting authentication for user:', email);
    
    if (!email || !inputPassword) {
      console.error('[Auth] Missing email or password');
      throw new Error('Email and password are required');
    }

    
    const existingUser = await User.findOne({ email }).select('+password');
    console.log("Hello", existingUser)


    if (!existingUser) {
      console.log('[Auth] User not found in database');
      throw new Error('User not found');
    }

    return {existingUser};

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  } catch (error) {
    console.error('Authentication error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      inputEmail: email,
      timestamp: new Date().toISOString()
    });
    throw error; 
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    if (!refreshTokens.has(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;

    
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    
    const accessToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );

    
    const newRefreshToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role
        },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);

    
    
    

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error('Refresh token error:', error);
    throw new Error('Failed to refresh token');
  }
};

export const revokeRefreshToken = async (refreshToken: string): Promise<boolean> => {
  try {
    return refreshTokens.delete(refreshToken);
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    return false;
  }
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
    }
    console.error('Token verification error:', error);
    throw new Error('Failed to verify token');
  }
};
