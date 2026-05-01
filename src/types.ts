/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DiamondCut {
  EXCELLENT = 'Excellent',
  VERY_GOOD = 'Very Good',
  GOOD = 'Good',
  FAIR = 'Fair'
}

export enum DiamondColor {
  D = 'D', E = 'E', F = 'F', // Colorless
  G = 'G', H = 'H', I = 'I', J = 'J' // Near Colorless
}

export enum DiamondClarity {
  FL = 'FL', IF = 'IF',
  VVS1 = 'VVS1', VVS2 = 'VVS2',
  VS1 = 'VS1', VS2 = 'VS2',
  SI1 = 'SI1', SI2 = 'SI2'
}

export enum DiamondShape {
  ROUND = 'Round',
  PRINCESS = 'Princess',
  EMERALD = 'Emerald',
  OVAL = 'Oval',
  RADIANT = 'Radiant',
  PEAR = 'Pear',
  HEART = 'Heart',
  MARQUISE = 'Marquise'
}

export enum CertificationLab {
  GIA = 'GIA',
  AGS = 'AGS',
  IGI = 'IGI'
}

export interface Diamond {
  id: string;
  slug: string;
  name: string;
  price: number;
  marketPrice?: number;
  originalPrice?: number;
  carat: number;
  cut: DiamondCut;
  color: DiamondColor;
  clarity: DiamondClarity;
  shape: DiamondShape;
  description: string;
  images: string[];
  certification: {
    lab: CertificationLab;
    number: string;
    url?: string;
  };
  inStock: boolean;
  isNew?: boolean;
  sale?: boolean;
}

export interface CartItem {
  id: string;
  diamond: Diamond;
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Review {
  id: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderUpdate {
  id: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  updates: OrderUpdate[];
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
}
