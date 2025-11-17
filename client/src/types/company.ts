export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyFormData {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  website: string;
}
