"use client";
// React & lib import
import { createIssue } from "@/actions/issue";
import { getOrganizationUsers } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import { issueSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue, Project } from "@prisma/client";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CreateIssueDrawer = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreate,
    orgId,
}: {
    isOpen: boolean;
    onClose: VoidFunction;
    sprintId: string;
    status: Issue["status"];
    projectId: Project["id"];
    onIssueCreate: VoidFunction;
    orgId: Project["organizationId"];
}) => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            title: "",
            priority: "MEDIUM",
            description: "",
            assigneeId: "",
        },
    });

    const {
        loading: createIssueLoading,
        fn: createIssueFn,
        error: createIssueError,
        data: newIssue,
    } = useFetch(createIssue);
    const {
        loading: usersLoading,
        fn: fetchUserFn,
        data: users,
    } = useFetch(getOrganizationUsers);

    useEffect(() => {
        if (isOpen && orgId) {
            fetchUserFn(orgId);
        }
    }, [isOpen, orgId]);

    // Submit Issue
    const onSubmit: SubmitHandler<Issue> = async (data: Issue) => {
        await createIssueFn(projectId, {
            ...data,
            status,
            sprintId,
        });
    };
    useEffect(() => {
        if (newIssue) {
            reset();
            onClose();
            onIssueCreate();
            toast.success("Issue created successfully");
        }
    }, [newIssue, createIssueLoading]);

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create Issue for member</DrawerTitle>
                </DrawerHeader>
                {usersLoading && (
                    <BarLoader
                        width={"100%"}
                        className="mt-2"
                        color="#36d7b7"
                    />
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 space-y-4"
                >
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-1"
                        >
                            Title
                        </label>
                        <Input id="title" {...register("title")} />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    {/* Select User */}
                    <div>
                        <label
                            htmlFor="assigneeId"
                            className="block text-sm font-medium mb-1"
                        >
                            Assignee
                        </label>
                        <Controller
                            name="assigneeId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((user) => {
                                            return (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.assigneeId && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.assigneeId.message}
                            </p>
                        )}
                    </div>
                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium mb-1"
                        >
                            Description
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    {/* Priority */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium mb-1"
                        >
                            Priority
                        </label>
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="HIGH">
                                            High
                                        </SelectItem>
                                        <SelectItem value="URGENT">
                                            Urgent
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {createIssueError && (
                        <p className="text-red-500 mt-2">
                            {createIssueError.message}
                        </p>
                    )}
                    <Button className="w-full" type="submit">
                        {createIssueLoading ? "Creating..." : "Create Issue"}
                    </Button>
                </form>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateIssueDrawer;
