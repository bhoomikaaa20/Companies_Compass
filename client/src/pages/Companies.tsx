import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CompanyTableSkeleton } from "@/components/CompanyTableSkeleton";
import { getCompanies, deleteCompany, industries, locations } from "@/lib/mockData";
import { Company } from "@/types/company";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Company | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        toast.error("Failed to load companies");
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    let filtered = companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === "all" || company.industry === selectedIndustry;
      const matchesLocation = selectedLocation === "all" || company.location === selectedLocation;
      return matchesSearch && matchesIndustry && matchesLocation;
    });

    if (sortField) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [companies, searchQuery, selectedIndustry, selectedLocation, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete) {
      try {
        await deleteCompany(companyToDelete);
        setCompanies(companies.filter((c) => c.id !== companyToDelete));
        toast.success("Company deleted successfully");
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        toast.error("Failed to delete company");
        console.error("Error deleting company:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <CompanyTableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground mt-1">Manage your company directory</p>
        </div>
        <Button asChild className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent">
          <Link to="/create">Add Company</Link>
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Select
          value={selectedIndustry}
          onValueChange={(value) => {
            setSelectedIndustry(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedLocation}
          onValueChange={(value) => {
            setSelectedLocation(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Name
                  {sortField === 'name' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('industry')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Industry
                  {sortField === 'industry' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('location')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Location
                  {sortField === 'location' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('size')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Size
                  {sortField === 'size' ? (
                    sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    {(() => {
                      const industry = company.industry.toLowerCase();
                      const industryStyles = {
                        technology: 'bg-blue-600/10 text-blue-600 focus-visible:ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:focus-visible:ring-blue-400/40 [a&]:hover:bg-blue-600/5 dark:[a&]:hover:bg-blue-400/5',
                        finance: 'bg-lime-600/10 text-lime-600 focus-visible:ring-lime-600/20 dark:bg-lime-400/10 dark:text-lime-400 dark:focus-visible:ring-lime-400/40 [a&]:hover:bg-lime-600/5 dark:[a&]:hover:bg-lime-400/5',
                        healthcare: 'bg-emerald-600/10 text-emerald-600 focus-visible:ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:focus-visible:ring-emerald-400/40 [a&]:hover:bg-emerald-600/5 dark:[a&]:hover:bg-emerald-400/5',
                        education: 'bg-purple-600/10 text-purple-600 focus-visible:ring-purple-600/20 dark:bg-purple-400/10 dark:text-purple-400 dark:focus-visible:ring-purple-400/40 [a&]:hover:bg-purple-600/5 dark:[a&]:hover:bg-purple-400/5',
                        retail: 'bg-orange-600/10 text-orange-600 focus-visible:ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:focus-visible:ring-orange-400/40 [a&]:hover:bg-orange-600/5 dark:[a&]:hover:bg-orange-400/5',
                        manufacturing: 'bg-stone-600/10 text-stone-600 focus-visible:ring-stone-600/20 dark:bg-stone-400/10 dark:text-stone-400 dark:focus-visible:ring-stone-400/40 [a&]:hover:bg-stone-600/5 dark:[a&]:hover:bg-stone-400/5',
                        energy: 'bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5',
                        media: 'bg-fuchsia-600/10 text-fuchsia-600 focus-visible:ring-fuchsia-600/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:focus-visible:ring-fuchsia-400/40 [a&]:hover:bg-fuchsia-600/5 dark:[a&]:hover:bg-fuchsia-400/5',
                        automotive: 'bg-indigo-600/10 text-indigo-600 focus-visible:ring-indigo-600/20 dark:bg-indigo-400/10 dark:text-indigo-400 dark:focus-visible:ring-indigo-400/40 [a&]:hover:bg-indigo-600/5 dark:[a&]:hover:bg-indigo-400/5',
                        logistics: 'bg-teal-600/10 text-teal-600 focus-visible:ring-teal-600/20 dark:bg-teal-400/10 dark:text-teal-400 dark:focus-visible:ring-teal-400/40 [a&]:hover:bg-teal-600/5 dark:[a&]:hover:bg-teal-400/5',
                        travel: 'bg-sky-600/10 text-sky-600 focus-visible:ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:focus-visible:ring-sky-400/40 [a&]:hover:bg-sky-600/5 dark:[a&]:hover:bg-sky-400/5',
                        entertainment: 'bg-rose-600/10 text-rose-600 focus-visible:ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400 dark:focus-visible:ring-rose-400/40 [a&]:hover:bg-rose-600/5 dark:[a&]:hover:bg-rose-400/5',
                        default: 'bg-slate-600/10 text-slate-600 focus-visible:ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-400 dark:focus-visible:ring-slate-400/40 [a&]:hover:bg-slate-600/5 dark:[a&]:hover:bg-slate-400/5'
                      };
                      const badgeStyles = industryStyles[industry] || industryStyles.default;

                      return (
                        <Badge className={cn('rounded-full border-none focus-visible:outline-none', badgeStyles)}>
                          {company.industry}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>{company.size}</TableCell>
                  <TableCell>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link to={`/edit/${company.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(company.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company from the directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
