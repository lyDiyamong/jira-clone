"use client";

// React & lib import
import React, { useEffect, useState } from "react";
import { Sprint, Issue, IssueStatus } from "@prisma/client";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";

// Custom import
import SprintManager from "./SprintManager";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssueDrawer from "./CreateIssueDrawer";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issue";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/IssueCard";
import { toast } from "sonner";
import BoardFilters from "./BoardFilters";

// Reorder index of issue card
const reorder = (
    list: Issue[],
    startIndex: number,
    endIndex: number
): Issue[] => {
    const result = Array.from(list);
    // issue that has been remove
    const [removed] = result.splice(startIndex, 1);
    // insert it back
    result.splice(endIndex, 0, removed);

    return result;
};

export type SprintBoardProps<Type = Sprint> = {
    sprints: Type[];
    projectId: string;
    orgId: string;
};

const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
    const [currentSprint, setCurrentSprint] = useState<Sprint>(
        sprints.find((spr) => spr?.status === "ACTIVE") || sprints[0]
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<null | string>(null);

    const handleAddIssue = (status: null | string) => {
        setSelectedStatus(status);
        setIsDrawerOpen(true);
    };

    // fetch issue for sprint
    const {
        fn: fetchIssues,
        data: issues,
        loading: issueLoading,
        setData: setIssues,
        error: issuesError,
    } = useFetch(getIssuesForSprint);

    useEffect(() => {
        if (currentSprint?.id) {
            fetchIssues(currentSprint?.id);
        }
    }, [currentSprint?.id]);

    // Filter change or search issue
    const [filteredIssues, setFilteredIssues] = useState(issues);
    const handleFilterChange = (newFilterIssues = issues) => {
        setFilteredIssues(newFilterIssues);
    };

    // update issue order and status
    const {
        fn: updateIssuesOrderFn,
        loading: updateIssuesLoading,
        error: updateIssuesError,
    } = useFetch(updateIssueOrder);
    // Create Issue function
    const handleIssueCreated = () => {
        // fetch issues again
        fetchIssues(currentSprint?.id);
    };
    // Drag handler
    const onDragEnd = async (result: DropResult) => {
        if (currentSprint?.status === "PLANNED") {
            toast.warning("Start the sprint to update board");
            return;
        }
        if (currentSprint?.status === "COMPLETED") {
            toast.warning("Cannot update board after sprint end");
            return;
        }

        // Destination : where to drop
        // source : where it came from
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const newOrderedData: Issue[] = [...issues];
        // Manipulate the index of each status

        const sourceList = newOrderedData.filter(
            (list) => list.status === source.droppableId
        );
        const destinationList = newOrderedData.filter(
            (list) => list.status === destination.droppableId
        );

        // if source and dest same
        if (source.droppableId === destination.droppableId) {
            const reorderedIssues = reorder(
                sourceList,
                source.index,
                destination.index
            );
            reorderedIssues.forEach((card, i) => {
                card.order = i;
            });
        }
        // remove card from the source to the dest
        else {
            // remove card from the source list
            const [movedCard] = sourceList.splice(source.index, 1);
            // assign the new list id to the moved card
            movedCard.status = destination.droppableId as IssueStatus;

            // add new card to the destination list
            destinationList.splice(destination.index, 0, movedCard);

            sourceList.forEach((card, i) => {
                card.order = i;
            });

            // update the order for each card in destination list
            destinationList.forEach((card, i) => {
                card.order = i;
            });
        }

        const sortedIssues = newOrderedData.sort(
            (a, b) => a.order - b.order
        ) as Issue[];
        setIssues(sortedIssues);

        // Backend logic here
        updateIssuesOrderFn(sortedIssues);
    };

    if (issuesError) return <div>Error Loading issues</div>;

    return (
        <>
            {/* Sprint Manager */}
            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />

            {issues && !issueLoading && (
                <BoardFilters
                    issues={issues}
                    onFilterChange={handleFilterChange}
                />
            )}

            {updateIssuesError && (
                <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
            )}
            {(updateIssuesLoading || issueLoading) && (
                <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />
            )}
            {/* Kanban board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 bg-slate-900 p-4 rounded-lg">
                    {statuses.map((status) => {
                        return (
                            <Droppable
                                key={status.key}
                                droppableId={status.key}
                            >
                                {(provided) => {
                                    return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2"
                                        >
                                            <h3 className="font-semibold mb-2 text-center">
                                                {status.name}
                                            </h3>
                                            {/* Issues */}

                                            {filteredIssues
                                                ?.filter(
                                                    (issue) =>
                                                        issue.status ===
                                                        status.key
                                                )
                                                .map((issue, index) => (
                                                    <Draggable
                                                        key={issue.id}
                                                        index={index}
                                                        draggableId={issue.id}
                                                        isDragDisabled={
                                                            updateIssuesLoading
                                                        }
                                                    >
                                                        {(provided) => {
                                                            return (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <IssueCard
                                                                        key={
                                                                            issue.id
                                                                        }
                                                                        issue={
                                                                            issue
                                                                        }
                                                                        showStatus
                                                                        onDelete={() =>
                                                                            fetchIssues(
                                                                                currentSprint?.id
                                                                            )
                                                                        }
                                                                        onUpdate={(
                                                                            updated
                                                                        ) =>
                                                                            setIssues(
                                                                                (
                                                                                    issue: Issue
                                                                                ) => {
                                                                                    if (
                                                                                        issue?.id ===
                                                                                        updated.id
                                                                                    )
                                                                                        return updated;
                                                                                    return issue;
                                                                                }
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            );
                                                        }}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                            {status.key === "TODO" &&
                                                currentSprint.status !==
                                                    "COMPLETED" && (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full"
                                                        onClick={() =>
                                                            handleAddIssue(
                                                                status.key
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 size-4" />
                                                        Create Issue
                                                    </Button>
                                                )}
                                        </div>
                                    );
                                }}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>
            <CreateIssueDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={currentSprint.id}
                status={selectedStatus}
                projectId={projectId}
                onIssueCreate={handleIssueCreated}
                orgId={orgId}
            />
        </>
    );
};

export default SprintBoard;
