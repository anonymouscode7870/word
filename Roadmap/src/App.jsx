import React, { useState, useEffect } from "react";

// ==========================================
// 1. COMPREHENSIVE MULTI-STAGE SYLLABUS DATA
// ==========================================
const tracks = [
  {
    id: "ai",
    label: "AI, ML & Data Engineering",
    color: "#4f7fff",
    light: "#e8effe",
    description: "A progressive, multi-stage vertical pipeline taking you from raw data mathematics up to production-grade Generative AI systems architecture.",
    phases: [
      {
        title: "Stage 1: Mathematics & Fundamentals",
        leaves: [
          "Linear Algebra: Matrices, Eigenvalues, SVD decomposition",
          "Calculus: Partial derivatives, gradients, chain rule optimization",
          "Probability & Statistics: Bayes theorem, distributions, CLT",
          "Numerical Computing: Python, NumPy vectorization, Pandas dataframes",
          "Exploratory Data Analysis: Data cleansing, missing value strategies",
          "Data Visualization: Advanced Matplotlib, Seaborn statistical plots"
        ]
      },
      {
        title: "Stage 2: Classical Machine Learning",
        leaves: [
          "Supervised Learning: Linear/Logistic regression, regularization",
          "Tree-based Models: Decision trees, Random Forests, XGBoost",
          "Support Vector Machines: Kernel tricks, hyperplanes, margins",
          "Unsupervised Clustering: K-Means, Hierarchical, DBSCAN",
          "Dimensionality Reduction: PCA, t-SNE components, variance",
          "Framework Mastery: Scikit-Learn pipelines, GridSearchCV tuning"
        ]
      },
      {
        title: "Stage 3: Deep Learning Architectures",
        leaves: [
          "Perceptrons & MLPs: Forward propagation, backpropagation algorithms",
          "Activation Functions: ReLU, Sigmoid, Softmax, Tanh optimization",
          "Computer Vision: Convolutional Neural Networks (CNNs), ResNet",
          "Sequential Models: RNNs, LSTMs, GRUs for sequence data",
          "Optimization Techniques: Adam, RMSprop, Dropout regularization",
          "Frameworks: PyTorch tensors vs TensorFlow Keras layers"
        ]
      },
      {
        title: "Stage 4: Generative AI & MLOps Infrastructure",
        leaves: [
          "Transformer Networks: Self-attention mechanisms, BERT, GPT foundations",
          "Large Language Models: Prompt engineering, few-shot conditioning",
          "Fine-Tuning Paradigms: Parameter-Efficient Fine-Tuning, LoRA, QLoRA",
          "Vector Databases: Semantic search using ChromaDB, Pinecone, FAISS",
          "Retrieval-Augmented Generation: LangChain, LlamaIndex architectures",
          "Production Pipelines: Dockerizing models, Triton Inference Server, FastAPI"
        ]
      }
    ]
  },
  {
    id: "mern",
    label: "Full-Stack MERN Architecture",
    color: "#10b981",
    light: "#e1f5ee",
    description: "A linear roadmap to engineer robust web systems, advancing step-by-step from user interfaces to backend runtime servers and secure database architecture.",
    phases: [
      {
        title: "Stage 1: Advanced Frontend Engine",
        leaves: [
          "Semantic HTML5 & layouts for accessibility layout design",
          "Modern CSS3: Flexbox, Grid, Custom Properties, Tailwind CSS utilities",
          "Advanced JavaScript: Closures, Event Loop, Prototypes, Async/Await",
          "React Core: Virtual DOM, component lifecycle, functional state hooks",
          "State Management: Context API, Redux Toolkit, actions, slices, thunks",
          "Performance Optimization: React.memo, useMemo, useCallback hooks"
        ]
      },
      {
        title: "Stage 2: Backend Core Engineering",
        leaves: [
          "Node.js Runtime: Asynchronous I/O architecture, Event Emitter loop",
          "Express.js Framework: HTTP request routing, static file pipelines",
          "Custom Middleware: Request logging, rate limiting, error handlers",
          "Architectural Patterns: Model-View-Controller (MVC) structuring",
          "RESTful Design Principles: Clean endpoint paths, standard HTTP status codes",
          "Real-time Engines: WebSockets layer integration via Socket.io library"
        ]
      },
      {
        title: "Stage 3: Database Architecture",
        leaves: [
          "NoSQL Concepts: Document-oriented database models vs Relational structures",
          "MongoDB Storage: Collections creation, indexes layout, query optimization",
          "Mongoose ODM: Data schema modeling, type validations, virtual properties",
          "Advanced Operations: Document CRUD execution, complex database filters",
          "Aggregation Pipeline: Match stages, group functions, lookup operations",
          "Data Relationships: Embedded reference structures vs Document populated models"
        ]
      },
      {
        title: "Stage 4: Security & Cloud Deployment",
        leaves: [
          "Authentication: JSON Web Tokens (JWT) creation, refresh token cycles",
          "Data Encryption: Password salting/hashing routines via bcrypt algorithms",
          "CORS Protection: Domain access white-listing configurations",
          "Input Validation: Request validation middleware using Joi or Zod schemas",
          "Cloud Platform Deployment: Hosting Express servers onto Render instances",
          "Frontend Distribution: Bundling production files to Vercel/Netlify edges"
        ]
      }
    ]
  },
  {
    id: "java",
    label: "Enterprise Java & Cloud Microservices",
    color: "#f97316",
    light: "#fff0e6",
    description: "An enterprise blueprint designed to transition from core systems programming into high-availability cloud cluster architectures.",
    phases: [
      {
        title: "Stage 1: Core Java & Systems Language",
        leaves: [
          "Object-Oriented Design: Polymorphism, abstraction, SOLID principles",
          "Java Memory Management: Heap space organization, garbage collection models",
          "Collections Framework: Lists, HashMaps, TreeSets architecture internals",
          "Functional Programming: Lambda expressions, functional interfaces, streams",
          "Concurrency: Multithreading primitives, thread pools, executor services",
          "Build Tooling: Maven/Gradle dependency graphs, packaging lifecycles"
        ]
      },
      {
        title: "Stage 2: Spring Boot Framework",
        leaves: [
          "Dependency Injection: Inversion of Control containers, bean definitions",
          "Aspect-Oriented Programming: Cross-cutting concerns, proxy patterns",
          "Spring Boot Configuration: Auto-configuration engines, properties files",
          "Web Architecture: Spring MVC REST APIs, content negotiation handlers",
          "Security Modules: Spring Security authorization, OAuth2 filter chains",
          "Testing Suites: Mockito structures, SpringBootTest mock server setups"
        ]
      },
      {
        title: "Stage 3: Persistence & Data Engineering",
        leaves: [
          "Java Persistence API: Entity definition layouts, primary key strategies",
          "Hibernate ORM: First/Second level caching optimization, dirty checking",
          "Spring Data JPA: Derived queries, custom specifications, pagination systems",
          "Transaction Management: Declarative transactional isolation levels",
          "Relational Storage: PostgreSQL schema design, complex inner/outer joins",
          "Caching Systems: Redis configuration layers, cache invalidation schemes"
        ]
      },
      {
        title: "Stage 4: Cloud & Microservices Grid",
        leaves: [
          "Microservice Patterns: Independent domain service communication methods",
          "Service Discovery: Netflix Eureka servers, instance registration layers",
          "API Gateway Routing: Spring Cloud Gateway filters, request transformation",
          "Resilience Architecture: Resilience4j circuit breakers, fallback configurations",
          "Distributed Messaging: Apache Kafka event-streaming topics, partitions",
          "Container Orchestration: Dockerization steps, Kubernetes deployment manifests"
        ]
      }
    ]
  }
];

// ==========================================
// 2. VERTICAL SEQUENTIAL PIPELINE COMPONENTS
// ==========================================
function RoadmapStage({ phase, color, light, isOpen, onToggle, isLast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "700px" }}>
      {/* Stage Core Box */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", width: "100%" }}>
        
        {/* Timeline Axis Spine Line Connector */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
          <div 
            onClick={onToggle}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: isOpen ? color : "#ffffff",
              border: `3px solid ${color}`,
              color: isOpen ? "#ffffff" : color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              zIndex: 2,
              transition: "all 0.2s ease"
            }}
          >
            {isOpen ? "▼" : "▶"}
          </div>
          
          {/* Connector Line down to the next stage container */}
          {!isLast && (
            <div style={{ 
              width: "4px", 
              flexGrow: 1, 
              background: `linear-gradient(to bottom, ${color}, #cbd5e1)`,
              minHeight: "40px",
              margin: "4px 0"
            }} />
          )}
        </div>

        {/* Content Box Panel */}
        <div style={{ flexGrow: 1, marginBottom: isLast ? "0px" : "28px" }}>
          <div
            onClick={onToggle}
            style={{
              background: light,
              border: `1px solid ${color}`,
              borderRadius: "12px",
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)",
              transition: "transform 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateX(2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              {phase.title}
            </h3>
            <span style={{ fontSize: "12px", color: color, fontWeight: "600", background: "#ffffff", padding: "4px 10px", borderRadius: "20px", border: `1px solid ${color}` }}>
              {phase.leaves.length} Subtopics
            </span>
          </div>

          {/* Child Leaves Block Dropdown Menu Grid */}
          {isOpen && (
            <div style={{ 
              marginTop: "12px", 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              gap: "10px",
              paddingLeft: "4px"
            }}>
              {phase.leaves.map((leaf, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    color: "#334155",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  {/* Left structural side tree link marker */}
                  <div style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0
                  }} />
                  <span style={{ lineHeight: "1.5" }}>{leaf}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN APP CANVAS CONTAINER
// ==========================================
export default function App() {
  const [activeId, setActiveId] = useState("ai");
  
  // Keep track of which specific pipeline blocks are open
  const [openStages, setOpenStages] = useState({
    "ai-0": true,
    "mern-0": true,
    "java-0": true
  });

  const currentTrack = tracks.find(t => t.id === activeId);

  function toggleStage(stageKey) {
    setOpenStages(prev => ({
      ...prev,
      [stageKey]: !prev[stageKey]
    }));
  }

  // Clear global template system layouts 
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "40px 16px",
      boxSizing: "border-box",
      color: "#1e293b"
    },
    header: {
      textAlign: "center",
      maxWidth: "700px",
      margin: "0 auto 32px auto"
    },
    h1: {
      fontSize: "28px",
      fontWeight: 800,
      color: "#0f172a",
      marginBottom: "10px",
      letterSpacing: "-0.02em"
    },
    sub: {
      fontSize: "15px",
      color: "#64748b",
      lineHeight: 1.5
    },
    tabs: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: "24px"
    },
    tabButton: (isActive, trackColor) => ({
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: 600,
      borderRadius: "30px",
      border: "1px solid",
      cursor: "pointer",
      background: isActive ? trackColor : "#ffffff",
      color: isActive ? "#ffffff" : "#475569",
      borderColor: isActive ? trackColor : "#e2e8f0",
      boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
      transition: "all 0.15s ease"
    }),
    trackDesc: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "16px 20px",
      maxWidth: "700px",
      margin: "0 auto 36px auto",
      textAlign: "center",
      fontSize: "14px",
      lineHeight: "1.6",
      color: "#475569"
    },
    pipelineCanvas: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: "700px",
      margin: "0 auto 48px auto"
    },
    footer: {
      maxWidth: "700px",
      margin: "0 auto",
      background: "#0f172a",
      borderRadius: "16px",
      padding: "24px 24px 32px 24px",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)"
    },
    footerTitle: {
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: 700,
      marginBottom: "4px"
    },
    footerSub: {
      color: "#94a3b8",
      fontSize: "13px",
      marginBottom: "20px",
      display: "block"
    },
    grid: {
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    },
    gridCard: {
      background: "#1e293b",
      borderRadius: "8px",
      padding: "14px 16px",
      border: "1px solid #334155"
    },
    gridStrong: {
      display: "block",
      color: "#38bdf8",
      fontSize: "13px",
      fontWeight: 600,
      marginBottom: "4px"
    },
    gridSpan: {
      fontSize: "12px",
      color: "#cbd5e1",
      lineHeight: "1.5",
      display: "block"
    }
  };

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>
        <h1 style={styles.h1}>🗺️ Sequential Learning Pipelines</h1>
        <p style={styles.sub}>
          A linear multi-parent hierarchy map. Each milestone opens directly below the previous stage preventing screen overflow.
        </p>
      </div>

      {/* Navigation Tabs Control */}
      <div style={styles.tabs}>
        {tracks.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            style={styles.tabButton(activeId === t.id, t.color)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Track Metadata Narrative Block */}
      <div style={styles.trackDesc}>
        {currentTrack.description}
      </div>

      {/* The Pure Vertical Tree Workspace Area */}
      <div style={styles.pipelineCanvas}>
        {currentTrack.phases.map((phase, index) => {
          const stageKey = `${currentTrack.id}-${index}`;
          return (
            <RoadmapStage
              key={stageKey}
              phase={phase}
              color={currentTrack.color}
              light={currentTrack.light}
              isOpen={!!openStages[stageKey]}
              onToggle={() => toggleStage(stageKey)}
              isLast={index === currentTrack.phases.length - 1}
            />
          );
        })}
      </div>

      {/* Foundation Skill Infrastructure Layer */}
      <div style={styles.footer}> 
        <div style={styles.footerTitle}>🛠️ Global Engineering Prerequisites</div>
        <span style={styles.footerSub}>Core concepts mandatory prior to beginning any track milestone pipeline</span>
        
        <div style={styles.grid}>
          {[
            { title: "Distributed Version Control (Git)", desc: "Branch isolating strategy, pull request workflows, interactive rebasing routines, and conflict mitigation patterns." },
            { title: "API Communication & Protocols", desc: "Designing idempotent REST architectures, handling JSON payload objects, and parsing client request streams safely." },
            { title: "Isolated Virtual Environments (Docker)", desc: "Writing optimized Dockerfiles, managing container image registries, and debugging storage volumes local bridges." }
          ].map(item => (
            <div key={item.title} style={styles.gridCard}>
              <strong style={styles.gridStrong}>{item.title}</strong>
              <span style={styles.gridSpan}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}