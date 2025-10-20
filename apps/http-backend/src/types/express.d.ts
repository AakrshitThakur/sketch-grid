import express from "express";

// Augmenting new keys to Request interface
declare global {
  namespace Express {
    interface Request {
      user_credentials?: {
        id: string;
      };
    }
  }
}
