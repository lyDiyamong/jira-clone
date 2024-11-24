import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/OrgSwitcher";
import React from "react";
import ProjectList from "../_components/ProjectList";
import UserIssues from "../_components/UserIssues";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

type Params = { orgId: any };

const Organization = async ({ params }: { params: Params }) => {
    const orgId = params.orgId;
    const organization = await getOrganization(orgId);

    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        {organization.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your organization's projects and tasks
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link href="/project/create">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            New Project
                        </Link>
                    </Button>
                    <OrgSwitcher />
                </div>
            </div>

            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Projects</h2>
                <p className="text-sm text-muted-foreground">
                    All projects in {organization.name}
                </p>
            </div>

            <ProjectList orgId={organization.id} />

            <div className="space-y-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Your Issues</h2>
                    <p className="text-sm text-muted-foreground">
                        Issues assigned to you or reported by you
                    </p>
                </div>
                <UserIssues userId={userId} />
            </div>
        </div>
    );
};

export default Organization;
