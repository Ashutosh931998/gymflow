import { Plan } from './types';

export const BASE_PLANS: Plan[] = [
  { id: "bp1", name: "Monthly Basic", duration: 1, price: 999, description: "Full gym floor access" },
  { id: "bp2", name: "Quarterly Pro", duration: 3, price: 2499, description: "Cardio + weights + locker" },
  { id: "bp3", name: "Half-Year Elite", duration: 6, price: 4499, description: "All access + 2 PT/month" },
  { id: "bp4", name: "Annual Premium", duration: 12, price: 7999, description: "Unlimited + nutrition plan" },
];

export const TRAINERS = ["Rahul Sharma", "Priya Patel", "Amit Singh", "Neha Gupta", "Self-Trained"];
export const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Net Banking"];

export const DB_PREFIX = "gymflow_v1_";
