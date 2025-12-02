export default function About() {
  return (
    <section id="about" className="container py-20 md:py-32">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground text-lg">
            Hello! I'm a software engineer with a passion for building
            innovative and user-friendly applications. I have experience in a
            variety of technologies, including React, Next.js, Node.js, and
            more. I'm always eager to learn new things and take on new
            challenges.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">My Skills</h3>
          <div className="flex flex-wrap gap-4">
            <span className="bg-secondary text-secondary-foreground py-2 px-4 rounded-full">
              React
            </span>
            <span className="bg-secondary text-secondary-foreground py-2 px-4 rounded-full">
              Next.js
            </span>
            <span className="bg-secondary text-secondary-foreground py-2 px-4 rounded-full">
              TypeScript
            </span>
            <span className="bg-secondary text-secondary-foreground py-2 px-4 rounded-full">
              Node.js
            </span>
            <span className="bg-secondary text-secondary-foreground py-2 px-4 rounded-full">
              Tailwind CSS
            </span>
            <span className="bg-secondary text-secondary-foreground py-2 px-4 rounded-full">
              GraphQL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
