export interface Property {
  propertyId?: number;
  ownerId: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  pricePerNight: number;
  maxGuests: number;
  propertyType: string;
  createdAt: Date;
}

export interface BaseResponse {
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Owner {
  ownerId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  registrationDate: Date; // or string
}

export interface Appointment {
  appointmentId: number;
  userId: number;
  ownerId: number;
  propertyId: number;
  appointmentDate: Date; // or string
  appointmentTime: Date; // or string
  appointmentStatus: string;
  reasonForVisit: string;
  createdAt: Date; // or string
}

export interface Tenant {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: number;
  registrationDate: Date; // or string
}

export interface ListPropertiesResponse extends BaseResponse {
  content: Property[];
}

export interface ListTenantsResponse extends BaseResponse {
  content: Tenant[];
}

export interface ListOwnersResponse extends BaseResponse {
  content: Owner[];
}

export interface ListAppointmentsResponse extends BaseResponse {
  content: Appointment[];
}
