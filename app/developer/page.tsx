"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Github, 
  Linkedin, 
  Mail, 
  Globe, 
  MapPin,
  Code2,
  Database,
  Server,
  Smartphone,
  ExternalLink,
  Download,
  ArrowLeft
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import Link from "next/link"
import Image from "next/image"

// Developer data
const developerData = {
  name: "Abdallah Mohamed",
  title: "Full Stack .NET Developer",
  image: "https://lh3.googleusercontent.com/d/1owvbaPoa3IL2LeJZ83bBkMTuIdlBEk6l",
  bio: "Passionate software engineer specializing in building scalable web applications and APIs using .NET technologies. Experienced in developing enterprise solutions with clean architecture and modern development practices.",
  location: "Egypt",
  website: "https://www.abdallahmohamed.tech",
  email: "abdoooomohamed88@gmail.com",
  github: "https://github.com/AbdallahMohamedDotnet",
  linkedin: "https://www.linkedin.com/in/abdallah-mohamed-dotnet",
  skills: {
    backend: [
      "C#", ".NET Core", "ASP.NET Web API", "Entity Framework Core", 
      "SQL Server", "PostgreSQL", "Redis", "RabbitMQ"
    ],
    frontend: [
      "React", "Next.js", "TypeScript", "Tailwind CSS", 
      "HTML5", "CSS3", "JavaScript"
    ],
    tools: [
      "Git", "Docker", "Azure", "Visual Studio", "VS Code",
      "Postman", "Swagger", "CI/CD"
    ],
    concepts: [
      "Clean Architecture", "SOLID Principles", "Design Patterns",
      "RESTful APIs", "Microservices", "Unit Testing"
    ]
  },
  projects: [
    {
      name: "Pharmacy Management System",
      description: "A full-featured pharmacy e-commerce platform with role-based dashboards for Admin, Pharmacist, and Customers.",
      tech: ["Next.js", ".NET Core", "SQL Server", "Tailwind CSS"],
      url: "https://github.com/AbdallahMohamedDotnet/pharmacy-management-system"
    },
    {
      name: "E-Commerce API",
      description: "RESTful API for e-commerce applications with authentication, product management, and order processing.",
      tech: [".NET Core", "Entity Framework", "JWT", "SQL Server"],
      url: "#"
    },
    {
      name: "Task Management System",
      description: "Collaborative task management application with real-time updates and team features.",
      tech: ["React", ".NET Core", "SignalR", "PostgreSQL"],
      url: "#"
    }
  ]
}

export default function DeveloperPage() {
  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = "abdallahmohamed-qr.png"
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to PharmaCare
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">
              <Code2 className="h-3 w-3 mr-1" />
              Developer Profile
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0 relative">
                  <Image
                    src={developerData.image}
                    alt={developerData.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl sm:text-3xl">{developerData.name}</CardTitle>
                  <CardDescription className="text-lg mt-1">{developerData.title}</CardDescription>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{developerData.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{developerData.bio}</p>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button asChild variant="outline" size="sm">
                  <a href={developerData.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={developerData.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={developerData.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${developerData.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scan to Visit</CardTitle>
              <CardDescription>My Portfolio Website</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={developerData.website}
                  size={160}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {developerData.website}
              </p>
              <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Backend */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Server className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Backend</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {developerData.skills.backend.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Frontend */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Frontend</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {developerData.skills.frontend.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Tools & DevOps</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {developerData.skills.tools.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Concepts */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Concepts</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {developerData.skills.concepts.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Featured Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {developerData.projects.map((project, index) => (
                <Card key={index} className="border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      {project.name}
                      {project.url !== "#" && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>© {new Date().getFullYear()} {developerData.name}. All rights reserved.</p>
          <p className="mt-1">
            Built with ❤️ using Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </main>
    </div>
  )
}
