import { Issue, IssuePriority, User } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slice, X } from "lucide-react";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const priorityColor = {
    LOW: "border-green-600",
    MEDIUM: "border-yellow-300",
    HIGH: "border-orange-400",
    URGENT: "border-red-400",
};

type IssueWithAssignee = Issue & { assignee: User };

const BoardFilters = ({
    issues,
    onFilterChange,
}: {
    issues: IssueWithAssignee[];
    onFilterChange: VoidFunction;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    // const [selectedAssignees, setSelectedAssignees] = useState([]);
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<
        IssuePriority | ""
    >("");

    // Extract unique assignees
    // const assignees = Array.from(
    //     new Set(issues.map((issue) => issue.assignee.id))
    // ).map((id) => issues.find((issue) => issue.assignee.id === id)!.assignee);
    const assignees = issues?.length
        ? (issues
              .map((issue) => issue.assignee)
              .filter(
                  (item, index, self) =>
                      item && index === self.findIndex((t) => t?.id === item.id)
              ) as User[])
        : [];

    const isFiltersApplied =
        searchTerm !== "" ||
        selectedAssignees.length > 0 ||
        selectedPriority !== "";

    // Clear filter handler
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedAssignees([]);
        setSelectedPriority("");
    };

    useEffect(() => {
        const filteredIssues = issues?.filter(
            (issue) =>
                issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedAssignees.length === 0 ||
                    selectedAssignees.includes(issue.assignee?.id)) &&
                (selectedPriority === "" || issue.priority === selectedPriority)
        );
        onFilterChange(filteredIssues);
    }, [searchTerm, selectedAssignees, selectedPriority, issues]);

    const toggleAssignee = (assigneeId) => {
        setSelectedAssignees((prev) =>
            prev.includes(assigneeId)
                ? prev.filter((id) => id !== assigneeId)
                : [...prev, assigneeId]
        );
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 ">
                <Input
                    className="w-full sm:w-72"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex-shrink-0">
                    <div className="flex gap-2 flex-wrap">
                        {assignees?.map((assignee, i) => {
                            const selected = selectedAssignees?.includes(
                                assignee.id
                            );
                            return (
                                <div
                                    key={assignee.id}
                                    className={`rounded-full ring cursor-pointer ${
                                        selected
                                            ? "ring-blue-600"
                                            : "ring-black"
                                    }`}
                                    style={{
                                        zIndex: assignees.length - i, // Higher z-index for earlier avatars
                                        marginLeft: i > 0 ? -24 : 0, // Adjust overlap (e.g., -24px)
                                        position: "relative", // Ensure z-index applies
                                    }}
                                    onClick={() => toggleAssignee(assignee.id)}
                                >
                                    <Avatar className="size-10">
                                        <AvatarImage src={assignee?.imageUrl} />
                                        <AvatarFallback>
                                            {assignee?.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Select
                    value={selectedPriority}
                    onValueChange={setSelectedPriority}
                    // disabled={!canChange}
                >
                    <SelectTrigger
                        className={`w-full sm:w-52 border ${priorityColor[selectedPriority]} rounded`}
                    >
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {priorityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isFiltersApplied && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="flex items-center"
                    >
                        <X className="size-4 " />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BoardFilters;
