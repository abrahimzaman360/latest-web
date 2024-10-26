// src/app/page.tsx
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Maximize, Minus, Terminal } from "lucide-react";
import Dock from "@/components/dock";
import TerminalImageRenderer from "@/components/terminal-image";

// Types
interface BlogPost {
  title: string;
  date: string;
  content: string;
  filename: string;
}

interface ContentSections {
  [key: string]: string;
}

interface BlogPosts {
  [key: string]: BlogPost;
}

interface WindowState {
  isMinimized: boolean;
  isMaximized: boolean;
  isDragging: boolean;
  position: Position;
}

interface Position {
  x: number;
  y: number;
}

const TerminalPortfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [typedText, setTypedText] = useState<string>("");
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [windowState, setWindowState] = useState<WindowState>({
    isMinimized: false,
    isDragging: false,
    isMaximized: false,
    position: { x: 0, y: 0 },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const dragRef = useRef<{ startX: number; startY: number }>({
    startX: 0,
    startY: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  // Blog posts data
  const blogPosts: BlogPosts = {
    "modern-web-development": {
      title: "Modern Web Development Trends 2024",
      date: "October 26, 2024",
      filename: "modern-web-development.md",
      content: `# Modern Web Development Trends 2024
Author: John Doe

## Key Trends

1. Server Components
   - Next.js and React Server Components
   - Improved performance and SEO
   - Reduced client-side JavaScript

2. Edge Computing
   - Serverless functions at the edge
   - Reduced latency
   - Better user experience

3. AI Integration
   - ChatGPT and similar models
   - Code assistance
   - Content generation`,
    },
    "docker-best-practices": {
      title: "Docker Best Practices for Production",
      date: "October 25, 2024",
      filename: "docker-best-practices.md",
      content: `# Docker Best Practices for Production
Author: Ibrahim Zaman

## Key Points

1. Multi-stage Builds
   - Reduce final image size
   - Separate build and runtime dependencies
   - Improved security

2. Security Considerations
   - Run as non-root user
   - Scan for vulnerabilities
   - Use specific tags

3. Performance Optimization
   - Layer caching
   - Minimal base images
   - Efficient Dockerfile instructions`,
    },
    "react-hooks-guide": {
      title: "Complete Guide to React Hooks",
      date: "October 24, 2024",
      filename: "react-hooks-guide.md",
      content: `# Complete Guide to React Hooks
Author: Ibrahim Zaman

## Essential Hooks

1. useState
   - State management
   - Component updates
   - Best practices

2. useEffect
   - Side effects
   - Cleanup functions
   - Dependencies

3. Custom Hooks
   - Reusable logic
   - Code organization
   - Testing strategies`,
    },
  };

  // Terminal sections content
  const generateContent = (tab: string): string => {
    const sections: ContentSections = {
      home: `Welcome to Ibrahim Zaman's terminal portfolio!
Feel free to explore by clicking the tabs above.

[ibrahimzaman-web:~/]$\nI'm a software developer passionate about creating elegant solutions.`,

      about: `[ibrahimzaman-web:~/about]$ cat about.txt

Name: Ibrahim Zaman <Mr Tux>
Role: Software engineer
Skills: 
- Frontend: React, NextJS, TypeScript
- Backend: Node.js
- DevOps: Docker, Vercel

Education:
- B.S. Accounting & Finance`,

      projects: `[ibrahimzaman-web:~/projects]$ ls -la
total: 4
-rw-r--r--  1 ibrahimzaman ibrahimzaman Oct 26 2024 project1/
-rw-r--r--  1 ibrahimzaman ibrahimzaman Oct 26 2024 project2/

[ibrahimzaman-web:~/projects]$ cat project1/README.md
# E-commerce Platform
- Built with MedusaJS and NextJS.
- Integrated payment processing
- Real-time inventory management

# Digital Creator Marketplace
- Built with AdonisJS, NextJS.
- 5000+ creators
- 97% commission-free
`,

      contact: `[ibrahimzaman-web:~/contact]$ echo $CONTACT_INFO

Email: abrahimzaman3@gmail.com
GitHub: github.com/abrahimzaman360
LinkedIn: linkedin.com/in/abrahimzaman360
Twitter: @abrahimzaman360

[ibrahimzaman-web:~/contact]$ echo "Feel free to reach out!"`,
    };

    if (tab === "blog") {
      if (selectedBlog) {
        const post = blogPosts[selectedBlog];
        return `[ibrahimzaman-web:~/blog]$ cat ${post.filename}\n\n${post.content}\n\n[user@portfolio ~/blog]$ echo "Type 'back' to return to blog list"`;
      }
      return `[ibrahimzaman-web:~/blog]$ ls -la blog/
total: ${Object.keys(blogPosts).length}
drwxr-xr-x  3 user  user  180 Oct 26 2024 .
drwxr-xr-x  5 user  user  180 Oct 26 2024 ..
${Object.entries(blogPosts)
  .map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([id, post]) =>
      `-rw-r--r--  1 user  user  2.1K ${post.date} ${post.filename}`
  )
  .join("\n")}

[user@portfolio ~/blog]$ echo "Select a blog post by clicking on its name"`;
    }

    return sections[tab] || "Command not found";
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLButtonElement) return;

    if (windowState.isMaximized) {
      // return to normal size window and make it draggable at their mouse position instead of center
      setWindowState((prev) => ({
        ...prev,
        isMaximized: false,
        isDragging: true,
        startPosition: {
          x: e.clientX - dragRef.current.startX,
          y: e.clientY - dragRef.current.startY,
        },
      }));

      return;
    }

    setWindowState((prev) => ({
      ...prev,
      isDragging: true,
    }));

    dragRef.current = {
      startX: e.clientX - windowState.position.x,
      startY: e.clientY - windowState.position.y,
    };
  };

  const handleMaximize = () => {
    setWindowState((prev) => ({
      ...prev,
      isMaximized: !prev.isMaximized,
      // Reset position when maximizing
      position: !prev.isMaximized ? { x: 0, y: 0 } : prev.position,
    }));
  };

  const handleDrag = (e: MouseEvent) => {
    if (!windowState.isDragging) return;

    setWindowState((prev) => ({
      ...prev,
      position: {
        x: e.clientX - dragRef.current.startX,
        y: e.clientY - dragRef.current.startY,
      },
    }));
  };

  const handleDragEnd = () => {
    setWindowState((prev) => ({
      ...prev,
      isDragging: false,
    }));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowState.isDragging]);

  // Typing effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const text = generateContent(activeTab);
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedBlog]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Handle blog post selection
  const handleBlogClick = (blogId: string): void => {
    if (activeTab === "blog") {
      setSelectedBlog(selectedBlog === blogId ? null : blogId);
    }
  };

  const ActiveHide = () => {
    // if window is minimized, show it
    if (windowState.isMinimized) {
      // show window
      setWindowState((prev) => ({
        ...prev,
        isMinimized: false,
      }));

      return;
    }

    // Show and Hide when clicked
    setIsVisible(!isVisible);
  };

  return (
    <div className="bg-black h-screen">
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div
            ref={windowRef}
            style={{
              transform: windowState.isMaximized
                ? "none"
                : `translate(${windowState.position.x}px, ${windowState.position.y}px)`,
              width: windowState.isMaximized ? "100%" : "800px",
              height: windowState.isMaximized ? "100%" : "600px",
            }}
            className={`bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 flex flex-col
    ${windowState.isMinimized ? "h-12" : ""}
    ${windowState.isMaximized ? "fixed inset-0 rounded-none" : ""}`}>
            {/* Terminal Header */}
            <div
              className="bg-gray-800 px-4 py-2 flex items-center justify-between cursor-move"
              onMouseDown={handleDragStart}>
              <div className="flex items-center space-x-2 flex-1">
                <Terminal className="h-4 w-4 text-gray-400" />
              </div>

              {/* Centered Title */}
              <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-400 text-sm font-semibold">
                Ibrahim Zaman - Terminal Web
              </div>

              {/* Window Controls */}
              <div className="flex space-x-2 z-10">
                <button
                  type="button"
                  onClick={() =>
                    setWindowState((prev) => ({
                      ...prev,
                      isMinimized: !prev.isMinimized,
                    }))
                  }
                  className="h-3 w-3 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-600 transition-colors">
                  <Minus className="h-2 w-2 text-yellow-900 opacity-0 hover:opacity-100" />
                </button>
                <button
                  type="button"
                  onClick={handleMaximize}
                  className="h-3 w-3 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Maximize className="h-2 w-2 text-green-900 opacity-0 hover:opacity-100" />
                </button>
              </div>
            </div>

            {!windowState.isMinimized && (
              <>
                {/* Terminal Tabs */}
                <div className="bg-gray-800 border-b border-gray-700 px-4 flex space-x-4">
                  {["home", "about", "projects", "blog", "contact"].map(
                    (tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          setSelectedBlog(null);
                        }}
                        className={`py-2 px-4 text-sm ${
                          activeTab === tab
                            ? "text-green-400 border-b-2 border-green-400"
                            : "text-gray-400 hover:text-gray-300"
                        }`}>
                        {tab}
                      </button>
                    )
                  )}
                </div>

                {activeTab === "about" && (
                  <>
                    <TerminalImageRenderer
                      src="/Me.JPG"
                      alt="Profile"
                      width={150}
                      height={150}
                    />{" "}
                  </>
                )}
                {/* Terminal Content with Scrollbar */}
                <div className="flex-1 overflow-auto">
                  <div className="p-4 font-mono text-sm h-full">
                    <div className="text-green-400 whitespace-pre-wrap">
                      {typedText}
                      {showCursor && <span className="text-green-400">▋</span>}
                    </div>

                    {/* Blog Post Links */}
                    {activeTab === "blog" && !selectedBlog && (
                      <div className="mt-4">
                        {Object.entries(blogPosts).map(([id, post]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => handleBlogClick(id)}
                            className="block text-blue-400 hover:text-blue-300 hover:underline mt-2">
                            → {post.filename} - {post.title}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Back Button for Blog Posts */}
                    {activeTab === "blog" && selectedBlog && (
                      <button
                        type="button"
                        onClick={() => setSelectedBlog(null)}
                        className="mt-4 text-blue-400 hover:text-blue-300">
                        ← back to blog list
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Dock
        isVisible={isVisible}
        isFunction={ActiveHide}
        isActive={isVisible}
      />
    </div>
  );
};

export default TerminalPortfolio;
