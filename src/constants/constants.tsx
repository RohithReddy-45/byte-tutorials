import {
  BarChart,
  BrainCog,
  Brush,
  CodeXml,
  Shield,
  TabletSmartphone,
} from "lucide-react";

export const COOKIE_NAME = "session";

export const PER_PAGE = 20;

export const technologies = [
  { label: "Angular", slug: "angular" },
  { label: "ASP.NET", slug: "aspnet" },
  { label: "Astro", slug: "astro" },
  { label: "AWS", slug: "aws" },
  { label: "C#", slug: "c#" },
  { label: "C++", slug: "c++" },
  { label: "Dart", slug: "dart" },
  { label: "Deno", slug: "deno" },
  { label: "Django", slug: "django" },
  { label: "Docker", slug: "docker" },
  { label: "Drizzle", slug: "drizzle" },
  { label: "Elixir", slug: "elixir" },
  { label: "Express.js", slug: "express-js" },
  { label: "Expo", slug: "expo" },
  { label: "Firebase", slug: "firebase" },
  { label: "Flask", slug: "flask" },
  { label: "Flutter", slug: "flutter" },
  { label: "Golang", slug: "golang" },
  { label: "GraphQL", slug: "graphql" },
  { label: "gRPC", slug: "grpc" },
  { label: "Haskell", slug: "haskell" },
  { label: "Java", slug: "java" },
  { label: "JavaScript", slug: "javascript" },
  { label: "Jest", slug: "jest" },
  { label: "Kotlin", slug: "kotlin" },
  { label: "Kubernetes", slug: "kubernetes" },
  { label: "Laravel", slug: "laravel" },
  { label: "Lua", slug: "lua" },
  { label: "MongoDB", slug: "mongodb" },
  { label: "MySQL", slug: "mysql" },
  { label: "Next.js", slug: "next-js" },
  { label: "Nuxt", slug: "nuxt" },
  { label: "Node.js", slug: "node-js" },
  { label: "Nginx", slug: "nginx" },
  { label: "NumPy", slug: "numpy" },
  { label: "Pandas", slug: "pandas" },
  { label: "PHP", slug: "php" },
  { label: "PostgreSQL", slug: "postgresql" },
  { label: "Python", slug: "python" },
  { label: "PyTorch", slug: "pytorch" },
  { label: "R", slug: "r" },
  { label: "React", slug: "react" },
  { label: "React Native", slug: "react-native" },
  { label: "Redis", slug: "redis" },
  { label: "REST API", slug: "rest-api" },
  { label: "Ruby", slug: "ruby" },
  { label: "Ruby on Rails", slug: "ruby-on-rails" },
  { label: "Rust", slug: "rust" },
  { label: "Sass", slug: "sass" },
  { label: "Scala", slug: "scala" },
  { label: "Scikit-learn", slug: "scikit-learn" },
  { label: "Socket.IO", slug: "socket-io" },
  { label: "Spring Boot", slug: "spring-boot" },
  { label: "Supabase", slug: "supabase" },
  { label: "Svelte", slug: "svelte" },
  { label: "Swift", slug: "swift" },
  { label: "Tailwind CSS", slug: "tailwind-css" },
  { label: "TensorFlow", slug: "tensorflow" },
  { label: "tRPC", slug: "trpc" },
  { label: "TypeScript", slug: "typescript" },
  { label: "Vue.js", slug: "vue-js" },
  { label: "WebSockets", slug: "websockets" },
];

export const categories = [
  {
    icon: <CodeXml size={48} className="stroke-foreground dark:stroke-white" />,
    title: "Web Development",
  },
  {
    icon: (
      <TabletSmartphone
        size={48}
        className="stroke-foreground dark:stroke-white"
      />
    ),
    title: "Mobile Development",
  },
  {
    icon: (
      <BarChart
        size={48}
        stroke="white"
        className="stroke-foreground dark:stroke-white"
      />
    ),
    title: "Data Science",
  },
  {
    icon: (
      <BrainCog
        size={48}
        stroke="white"
        className="stroke-foreground dark:stroke-white"
      />
    ),
    title: "Machine Learning",
  },
  {
    icon: (
      <Brush
        size={48}
        stroke="white"
        className="stroke-foreground dark:stroke-white"
      />
    ),
    title: "Design",
  },
  {
    icon: (
      <Shield
        size={48}
        stroke="white"
        className="stroke-foreground dark:stroke-white"
      />
    ),
    title: "Cybersecurity",
  },
];
