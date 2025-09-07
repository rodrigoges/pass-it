
export enum UserType {
  ADMIN = 'ADMIN',
  INSTITUTION = 'INSTITUTION',
  DONOR = 'DONOR',
  REQUESTER = 'REQUESTER',
}

export enum ItemCategory {
  CLOTHES = 'CLOTHES',
  FOOD = 'FOOD',
  TOYS = 'TOYS',
  FURNITURE = 'FURNITURE',
  OTHER = 'OTHER',
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  DONATED = 'DONATED',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  nationalIdentifier: string;
  userType: UserType;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  imageUrl: string | null;
  status: ItemStatus;
  donorId: string;
  donor: User;
  createdAt: string;
  updatedAt: string;
}

export interface Requisition {
    id: string;
    itemId: string;
    item: Item;
    requesterId: string;
    requester: User;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface ApiError {
    message: string;
    statusCode: number;
}
