import { BarChart, Calendar, Layout } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

// 1. Define a type for each feature item
type FeatureItem = {
    title: string;
    description: string;
    icon: React.ElementType; // Using ElementType allows the icon to be a component
};

const features: FeatureItem[] = [
    {
        title: "Intuitive Kanban Boards",
        description:
            "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
        icon: Layout,
    },
    {
        title: "Powerful Sprint Planning",
        description:
            "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
        icon: Calendar,
    },
    {
        title: "Comprehensive Reporting",
        description:
            "Gain insights into your team's performance with detailed, customizable reports and analytics.",
        icon: BarChart,
    },
];

function Feature() {
    return (
        <section id="features" className="bg-gray-900 py-20 px-5 mt-12">
            <div>
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Key Features
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        return (
                            <Card key={index} className="bg-gray-800 p-6">
                                <CardContent className="flex justify-center">
                                    <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                                </CardContent>
                                <CardHeader>
                                    <CardTitle className="leading-5">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardDescription className="text-start text-gray-300">
                                    {feature.description}
                                </CardDescription>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default Feature;
