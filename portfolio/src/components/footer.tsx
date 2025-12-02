export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex-col md:flex-row flex items-center justify-between py-8">
        <p className="text-sm text-muted-foreground">
          © 2025 My Portfolio. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a href="#" className="text-muted-foreground hover:text-primary">
            Twitter
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary">
            GitHub
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
