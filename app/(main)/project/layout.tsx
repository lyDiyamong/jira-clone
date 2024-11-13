import React, { ReactNode } from "react";

const ProjectLayout = ({ chidren }: { children: ReactNode }) => {
    return <div className="container mx-auto mt-5">{chidren}</div>;
};

export default ProjectLayout;
