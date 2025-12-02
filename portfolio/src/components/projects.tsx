"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Project One",
    description:
      "A brief description of the first project. What it does, why it's cool, and what technologies were used.",
    tags: ["React", "Next.js"],
  },
  {
    title: "Project Two",
    description:
      "A brief description of the second project. What it does, why it's cool, and what technologies were used.",
    tags: ["React", "TypeScript"],
  },
  {
    title: "Project Three",
    description:
      "A brief description of the third project. What it does, why it's cool, and what technologies were used.",
    tags: ["Next.js", "Tailwind CSS"],
  },
  {
    title: "Project Four",
    description:
      "A brief description of the fourth project. What it does, why it's cool, and what technologies were used.",
    tags: ["React", "GraphQL"],
  },
];

const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags))];

export default function Projects() {
  const [activeTag, setActiveTag] = useState("All");

  const filteredProjects =
    activeTag === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <section id="projects" className="container py-20 md:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        My Projects
      </h2>
      <div className="flex justify-center gap-4 mb-8">
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={activeTag === tag ? "default" : "outline"}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 bg-secondary rounded-lg"></div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="#">View Project</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
