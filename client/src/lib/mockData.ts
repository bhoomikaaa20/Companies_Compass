import { Company, CompanyFormData } from "@/types/company";

export async function getCompanies(): Promise<Company[]> {
  const response = await fetch("https://companies-compass.onrender.com/api/companies");
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }
  return response.json();
}

export async function createCompany(data: CompanyFormData): Promise<Company> {
  const response = await fetch("https://companies-compass.onrender.com/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create company");
  }
  return response.json();
}

export async function updateCompany(id: string, data: CompanyFormData): Promise<Company> {
  const response = await fetch(`https://companies-compass.onrender.com/api/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update company");
  }
  return response.json();
}

export async function deleteCompany(id: string): Promise<void> {
  const response = await fetch(`https://companies-compass.onrender.com/api/companies/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete company");
  }
}

export const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Energy",
  "Media",
  "Automotive",
  "Logistics",
  "Travel",
];

export const locations = [
  "San Francisco",
  "New York",
  "Boston",
  "Austin",
  "Chicago",
  "Detroit",
  "Seattle",
  "Denver",
  "Los Angeles",
  "Miami",
  "Orlando",
];

export const companySizes = ["1-50", "50-100", "100-500", "500-1000", "1000-5000", "5000+"];
