import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { updateCompany, industries, locations, companySizes } from "@/lib/mockData";
import { toast } from "sonner";
import { Company, CompanyFormData } from "@/types/company";

export default function EditCompany() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;

      try {
        // For now, we'll need to fetch all companies and find the one by id
        // In a real app, there might be a getCompany(id) endpoint
        const companies = await import("@/lib/mockData").then(m => m.getCompanies());
        const foundCompany = companies.find((c) => c.id === id);
        if (foundCompany) {
          setCompany(foundCompany);
          setFormData({
            name: foundCompany.name,
            industry: foundCompany.industry,
            location: foundCompany.location,
            size: foundCompany.size,
            website: foundCompany.website,
          });
        } else {
          toast.error("Company not found");
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to load company");
        console.error("Error fetching company:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
    if (!formData.size) {
      newErrors.size = "Company size is required";
    }
    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (!/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!id) return;

    setSaving(true);
    try {
      await updateCompany(id, formData as CompanyFormData);
      toast.success("Company updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update company");
      console.error("Error updating company:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Companies
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Company</CardTitle>
          <CardDescription>Update company information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter company name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.size && <p className="text-sm text-destructive">{errors.size}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website *</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
              {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
