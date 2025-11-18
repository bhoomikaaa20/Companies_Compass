import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Edit, ExternalLink, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  rectIntersection,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { getCompanies, industries, locations, updateCompany } from "@/lib/mockData";
import { Company, CompanyFormData } from "@/types/company";
import { toast } from "sonner";

// Droppable Column Component
function DroppableColumn({ industry, companies, children }: { industry: string; companies: Company[]; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${industry}`,
  });

  return (
    <div
      ref={setNodeRef}
      data-industry={industry}
      className={`p-4 border-2 border-dashed rounded-lg transition-colors ${isOver
        ? "border-primary bg-primary/10"
        : "border-muted-foreground/20 bg-muted/20 hover:bg-muted/40"
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg">{industry}</h2>
        <Badge variant="secondary">{companies.length}</Badge>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {children}
      </div>
    </div>
  );
}

// Draggable Card Component
function DraggableCard({ company }: { company: Company }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: company.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`hover:shadow-md transition-shadow cursor-move ${isDragging ? "opacity-50" : ""
        }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-base line-clamp-1">{company.name}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" asChild>
            <Link to={`/edit/${company.id}`}>
              <Edit className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{company.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{company.size} employees</span>
        </div>
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          Visit Website
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}

export default function KanbanView() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === "all" || company.industry === selectedIndustry;
      const matchesLocation = selectedLocation === "all" || company.location === selectedLocation;
      return matchesSearch && matchesIndustry && matchesLocation;
    });
  }, [companies, searchQuery, selectedIndustry, selectedLocation]);

  const groupedByIndustry = useMemo(() => {
    const groups: Record<string, Company[]> = {};
    filteredCompanies.forEach((company) => {
      if (!groups[company.industry]) {
        groups[company.industry] = [];
      }
      groups[company.industry].push(company);
    });
    return groups;
  }, [filteredCompanies]);

  // Maintain consistent column order based on the predefined industries list
  const orderedIndustries = useMemo(() => {
    const industrySet = new Set(Object.keys(groupedByIndustry));
    return industries.filter(industry => industrySet.has(industry));
  }, [groupedByIndustry]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Only process drops on droppable areas (columns), not on other cards
    if (!overId.startsWith('droppable-')) {
      setActiveId(null);
      return;
    }

    // Extract the actual industry name from droppable id
    const targetIndustry = overId.replace('droppable-', '');

    // Only process drops on droppable areas (columns), not on other cards
    if (!overId.startsWith('droppable-')) {
      console.log("Drop ignored - not on a droppable area");
      setActiveId(null);
      return;
    }

    // Find the company and new industry
    const company = companies.find((c) => c.id === activeId);
    if (!company) {
      setActiveId(null);
      return;
    }

    // If dropped on the same industry, do nothing
    if (company.industry === targetIndustry) {
      setActiveId(null);
      return;
    }

    // Optimistically update the UI
    setCompanies((prevCompanies) =>
      prevCompanies.map((c) =>
        c.id === company.id ? { ...c, industry: targetIndustry } : c
      )
    );

    // Update the company's industry in the database
    try {
      await updateCompany(company.id, { ...company, industry: targetIndustry } as CompanyFormData);
      toast.success(`Moved ${company.name} to ${targetIndustry}`);
    } catch (error) {
      console.error("Error updating company industry:", error);
      toast.error("Failed to update company industry");

      // Revert the optimistic update on error
      setCompanies((prevCompanies) =>
        prevCompanies.map((c) =>
          c.id === company.id ? { ...c, industry: company.industry } : c
        )
      );
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) => {
        // Use rectIntersection for droppable areas, closestCenter for others
        const droppableCollisions = rectIntersection({
          ...args,
          droppableContainers: args.droppableContainers.filter(container =>
            container.id.toString().startsWith('droppable-')
          ),
        });

        if (droppableCollisions.length > 0) {
          return droppableCollisions;
        }

        // Fallback to pointerWithin for other cases
        return pointerWithin(args);
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Kanban View</h1>
            <p className="text-muted-foreground mt-1">Companies organized by industry</p>
          </div>
          <Button asChild className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent">

            <Link to="/create">Add Company</Link>
          </Button>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
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

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80">
                <Card className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedByIndustry).length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No companies found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 min-h-[400px]">
            {orderedIndustries.map((industry) => (
              <div key={industry} className="flex-shrink-0 w-80">
                <DroppableColumn industry={industry} companies={groupedByIndustry[industry] || []}>
                  <SortableContext items={(groupedByIndustry[industry] || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {(groupedByIndustry[industry] || []).map((company) => (
                      <DraggableCard key={company.id} company={company} />
                    ))}
                  </SortableContext>
                </DroppableColumn>
              </div>
            ))}
          </div>
        )}
      </div>
    </DndContext>
  );
}
