/**
 * Sample Resumes and Job Descriptions for instant testing & evaluation
 * Represents different candidate profiles:
 *  1. Senior Full-Stack Engineer (Strong Fit - 92%)
 *  2. Cloud / DevOps Architect (Moderate Fit - 74% - Missing AWS / Terraform depth)
 *  3. Junior / Career Changer (Weak Fit - 48% - Missing seniority, gaps in core stack)
 */

window.SAMPLE_PRESETS = [
  {
    id: "senior-fullstack",
    title: "Senior Full-Stack Engineer",
    fitType: "Strong Fit",
    targetRole: "Senior Full-Stack Engineer (React / Node / TypeScript / Distributed Systems)",
    resumeText: `ALEX RIVERA, LEAD FULL-STACK SOFTWARE ENGINEER
San Francisco, CA | linkedin.com/in/alex-rivera-example | github.com/arivera-code

PROFESSIONAL SUMMARY
Results-driven Lead Full-Stack Engineer with 8+ years of production experience designing, building, and scaling high-throughput distributed web applications. Expert in TypeScript, React, Node.js, GraphQL, PostgreSQL, and cloud-native architecture on AWS. Proven track record leading 6-person engineering pods, reducing p99 API latencies by 42%, and architecting microservices handling 25M+ daily requests.

CORE COMPETENCIES & TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, Go (working knowledge)
- Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Jest, Cypress
- Backend & Distributed: Node.js, Express, NestJS, REST APIs, GraphQL, Kafka, Redis, RabbitMQ
- Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS (ECS, S3, RDS, Lambda, CloudWatch, Terraform)
- Architecture & Practices: Microservices, Event-Driven Architecture, CI/CD (GitHub Actions), TDD, Agile/Scrum, System Design

PROFESSIONAL EXPERIENCE

Lead Full-Stack Engineer | Nexus Cloud Systems (Series C SaaS, $50M ARR)
March 2022 – Present | San Francisco, CA
- Spearheaded the architectural migration of core billing and subscription engine from a monolithic Rails app to TypeScript/Node.js microservices on AWS ECS, improving availability to 99.99% and processing $12M/month in transactions.
- Designed and delivered high-performance analytics dashboard in React 18/Next.js and GraphQL, reducing initial bundle size by 38% and dropping page load time from 3.8s to 1.1s.
- Introduced Kafka event streaming for real-time customer event ingestion, scaling system capacity from 3,000 to 45,000 events/sec.
- Mentored 5 junior and mid-level engineers, instituted rigorous peer code review guidelines, and drove unit test coverage from 54% to 88%.

Senior Software Engineer | DataPulse Technologies
August 2018 – February 2022 | Austin, TX
- Developed customer-facing data visualization platform using React, D3.js, and Node.js RESTful APIs used by 120,000+ monthly active enterprise users.
- Optimized slow SQL queries on PostgreSQL tables exceeding 100M rows, cutting p95 query times from 4.2s to 280ms through schema indexing, read replicas, and Redis caching.
- Built automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing deployment cycle time from 4 hours to 12 minutes with zero downtime releases.
- Collaborated closely with Product and UX teams to build accessible (WCAG AA), responsive web components.

Software Engineer | BrightPath Interactive
June 2016 – July 2018 | Austin, TX
- Implemented full-stack features for client e-commerce platforms using Node.js, React, and MongoDB.
- Integrated Stripe and PayPal payment gateways with comprehensive webhook idempotency handling.
- Authored integration and end-to-end test suites using Jest and Cypress, reducing regression bugs by 30%.

EDUCATION & CERTIFICATIONS
- B.S. in Computer Science | University of Texas at Austin (2016)
- AWS Certified Solutions Architect – Associate (Active, 2023)
- Certified ScrumMaster (CSM, 2021)`,
    jobDescription: `Job Title: Senior Full-Stack Engineer (TypeScript / React / Node.js)
Department: Core Platform Engineering
Location: Remote (US) / Hybrid
Company: Apex Scale Enterprise Software

About the Role:
We are seeking an experienced Senior Full-Stack Engineer with 6+ years of professional software engineering experience to own critical pillars of our enterprise workflow automation platform. In this role, you will architect resilient backend microservices, craft performant, accessible React user interfaces, and collaborate with cross-functional teams to deliver enterprise-grade features.

Key Responsibilities:
- Design, build, and maintain scalable, robust full-stack applications in TypeScript, React, and Node.js.
- Architect high-throughput distributed services and integrate event-driven messaging (Kafka, RabbitMQ, or SQS).
- Optimize relational databases (PostgreSQL/MySQL) and caching layers (Redis) for low-latency queries at scale.
- Drive cloud infrastructure best practices on AWS (ECS, Lambda, S3, Docker).
- Champion software engineering excellence, including test-driven development (TDD), automated CI/CD pipelines, and thoughtful code reviews.
- Mentor junior and mid-level engineers and contribute to technical roadmapping and architecture decisions.

Requirements (Must Haves):
- 6+ years of full-stack software development experience in production environments.
- Deep expertise in TypeScript, modern JavaScript, and React (hooks, state management, performance optimization).
- Proven experience designing and building RESTful APIs and microservices using Node.js.
- Strong practical knowledge of PostgreSQL (schema design, query optimization, indexing).
- Hands-on experience with Docker, container orchestration, and cloud platforms (AWS preferred).
- Experience with automated testing frameworks (Jest, Cypress, or similar) and CI/CD workflows.
- Excellent communication skills and demonstrated ability to mentor engineers.

Preferred Qualifications (Nice to Haves):
- Experience with GraphQL and Next.js.
- Experience with distributed event streaming platforms (Apache Kafka).
- AWS Solutions Architect certification.
- Familiarity with Infrastructure as Code (Terraform).
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.`
  },

  {
    id: "devops-architect",
    title: "DevOps & Cloud Engineer (Moderate Fit)",
    fitType: "Moderate Fit",
    targetRole: "Principal SRE / Cloud Architect (Kubernetes / Multi-Cloud / Terraform)",
    resumeText: `JORDAN CHEN, SENIOR DEVOPS ENGINEER
Seattle, WA | linkedin.com/in/jordan-chen-devops

PROFESSIONAL SUMMARY
Senior DevOps & Infrastructure Engineer with 5+ years of experience managing Linux infrastructure, Docker containerization, CI/CD pipelines, and GCP cloud environments. Passionate about automating repetitive workflows, monitoring system uptime with Prometheus/Grafana, and maintaining 99.9% SLA across cloud workloads.

SKILLS & TOOLS
- Cloud: Google Cloud Platform (GCP - GKE, Compute Engine, Cloud Storage, Cloud SQL), Basic AWS (EC2, S3)
- Containers & Orchestration: Docker, Docker Swarm, Kubernetes (GKE beginner/intermediate)
- CI/CD & Automation: Jenkins, GitLab CI, Bash scripting, Python scripting
- Infrastructure as Code: Ansible, Helm, introductory Terraform
- Observability: Prometheus, Grafana, ELK Stack, Datadog
- Operating Systems: Linux (Ubuntu, Debian, RHEL), Networking fundamentals (DNS, SSL/TLS, VPC)

WORK EXPERIENCE

Senior DevOps Engineer | CloudStream Media
January 2022 – Present | Seattle, WA
- Managed 60+ Linux virtual machines on Google Cloud Platform hosting high-traffic video streaming transcoding services.
- Maintained CI/CD pipelines in GitLab CI, deploying 40+ microservices builds per week to staging and production.
- Configured Prometheus metrics scraping and Grafana dashboards, alerting on CPU thresholds and memory bottlenecks.
- Automated system provisioning and patching across server fleets using Ansible playbooks.
- Assisted with Kubernetes container migration on GCP Google Kubernetes Engine (GKE).

DevOps Engineer | Bluefin Software Solutions
July 2019 – December 2021 | Portland, OR
- Supported development teams by automating testing and build pipelines using Jenkins and Docker.
- Administered centralized logging using Elasticsearch, Logstash, and Kibana (ELK), reducing root-cause debug time.
- Managed SSL certificates and NGINX reverse proxies for 20+ client web applications.
- Wrote Bash and Python maintenance scripts for database backups and automated snapshot policies.

Systems Administrator | Cascade IT Services
June 2017 – June 2019 | Portland, OR
- Administered local office Linux and Windows servers, VPNs, and firewall rules.
- Supported 200+ internal employees with IT infrastructure and access permissions.

EDUCATION & CERTS
- B.S. in Information Technology | Oregon State University (2017)
- Google Cloud Certified Associate Cloud Engineer (2021)
- Docker Certified Associate (2020)`,
    jobDescription: `Job Title: Principal Site Reliability Engineer & Multi-Cloud Architect
Location: Seattle, WA / Hybrid
Company: Global Financial Technologies (FinTech Tier-1)

Overview:
We are looking for a Principal Site Reliability Engineer / Cloud Architect with 8+ years of experience leading multi-region AWS and Azure high-availability financial infrastructure. In this role, you will be the primary technical authority for zero-downtime banking transactions, managing large-scale Kubernetes clusters (EKS) spanning 1,000+ nodes, and writing enterprise Terraform modules.

Must-Have Requirements:
- 8+ years of dedicated Site Reliability Engineering (SRE) or Cloud Infrastructure Architecture experience.
- Deep, expert-level mastery of Amazon Web Services (AWS) multi-region architecture (VPC peering, Transit Gateways, IAM least-privilege, DirectConnect).
- Advanced Kubernetes production engineering: Custom Resource Definitions (CRDs), Istio service mesh, Cilium CNI, cluster autoscaling, and disaster recovery.
- Production mastery of Infrastructure as Code using Terraform (custom provider development, state locking, Terragrunt).
- Proven experience with strict compliance standards: PCI-DSS, SOC 2 Type II, ISO 27001, and financial audit readiness.
- Deep background in Chaos Engineering, SLA/SLO definition, and incident command for tier-0 distributed financial systems.

Nice to Haves:
- Experience with HashiCorp Vault enterprise and Consul.
- AWS Certified Solutions Architect Professional or CKA (Certified Kubernetes Administrator).
- FinTech / Payment processing background.`
  },

  {
    id: "junior-career-changer",
    title: "Junior Developer / Career Changer (Weak Fit)",
    fitType: "Weak Fit",
    targetRole: "Staff Distributed Systems Architect",
    resumeText: `SAM TAYLOR, JUNIOR DEVELOPER
Denver, CO | github.com/samtaylor-dev

SUMMARY
Motivated Junior Software Developer with 10 months of experience building responsive web pages using HTML, CSS, JavaScript, and introductory React. Recently graduated from an intensive 16-week Full-Stack Web Development Bootcamp after transitioning from retail management. Seeking an opportunity to grow as a software engineer.

TECHNICAL SKILLS
- Languages: JavaScript (ES6), HTML5, CSS3, Python (basics)
- Libraries & Frameworks: React (hooks basics), Bootstrap, Express.js (beginner)
- Databases & Tools: MongoDB, Git, GitHub, VS Code, Postman, Netlify, Heroku

PROJECTS
Recipe Finder Web App (Bootcamp Capstone Project) - 2024
- Built a single-page recipe search app using React and the Spoonacular REST API.
- Implemented search by ingredient and saved favorite recipes to local storage.
- Deployed frontend to Netlify and backend proxy to Heroku.

Personal Portfolio & Blog - 2023
- Designed responsive personal portfolio website using semantic HTML and CSS Grid.

EMPLOYMENT HISTORY
Store Assistant Manager | Retail Horizon
May 2019 – September 2023 | Denver, CO
- Managed team of 8 sales associates and supervised daily store operations.
- Resolved customer complaints and managed inventory reconciliations.

EDUCATION & TRAINING
- Certificate of Full-Stack Web Development | Denver Coding Bootcamp (16-week intensive, 2024)
- B.A. in Communications | University of Colorado (2018)`,
    jobDescription: `Job Title: Staff Distributed Systems Architect (C++ / Rust / Distributed Databases)
Company: DataMesh Core Infrastructure
Experience Level: Staff / Principal (10+ years required)

We are seeking a Staff Distributed Systems Architect to lead the design and implementation of our next-generation globally distributed consensus engine (Raft/Paxos).

Qualifications:
- 10+ years of software engineering experience with deep focus on systems programming (Rust, C++, or Go).
- Extensive experience designing distributed consensus protocols, log-structured merge trees (LSM), and distributed transactions (2PC, Spanner-style TrueTime).
- Proven track record authoring papers or production systems handling petabyte-scale datasets across geographically dispersed data centers.
- Deep mastery of Linux kernel internals, zero-copy networking (eBPF, DPDK), and cache-coherent lock-free data structures.
- M.S. or Ph.D. in Computer Science or equivalent demonstrated research and production contributions.`
  }
];
