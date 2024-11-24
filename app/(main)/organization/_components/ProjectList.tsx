import { getProjects } from "@/actions/project";
import Link from "next/link";
import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, LayersIcon, Users2 } from "lucide-react";
import DeleteProject from "./DeleteProject";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProjectList = async ({ orgId }: { orgId: string }) => {
    const projects = await getProjects(orgId);

    if (projects?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4">
                    <LayersIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No Projects Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first project
                </p>
                <Button asChild>
                    <Link href="/project/create">Create New Project</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
                <Card key={project?.id} className="group hover:shadow-lg transition-all">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">
                                    {project?.name}
                                </CardTitle>
                                <CardDescription>
                                    {project?.key || 'No Key'}
                                </CardDescription>
                            </div>
                            <DeleteProject projectId={project.id} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className={cn(
                            "text-sm text-muted-foreground mb-4",
                            "line-clamp-2 h-10"
                        )}>
                            {project?.description || 'No description provided'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Users2 className="h-4 w-4" />
                                <span>0 members</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex items-center justify-between">
                            <Badge variant="secondary">
                                Active
                            </Badge>
                            <Button variant="ghost" className="hover:bg-primary/5" asChild>
                                <Link href={`/project/${project.id}`}>
                                    View Project
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default ProjectList;
