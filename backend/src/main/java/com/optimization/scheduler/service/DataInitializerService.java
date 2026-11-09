package com.optimization.scheduler.service;

import com.optimization.scheduler.model.*;
import com.optimization.scheduler.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class DataInitializerService implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private DeveloperRepository developerRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private ServerNodeRepository serverNodeRepository;
    @Autowired private ResourceAllocationRepository resourceAllocationRepository;
    @Autowired(required = false) private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String encodedPass = passwordEncoder != null ? passwordEncoder.encode("password") : "password";

        // ── 1. Seed Users ──────────────────────────────────────────────────
        if (userRepository.count() == 0) {
            userRepository.save(new User("admin", encodedPass, "System Administrator", User.Role.ADMIN));
            userRepository.save(new User("pm", encodedPass, "Project Manager", User.Role.PROJECT_MANAGER));
            userRepository.save(new User("dev", encodedPass, "Lead Developer", User.Role.DEVELOPER));
        }

        // ── 2. Seed Skills ─────────────────────────────────────────────────
        Skill java    = skillRepository.findByName("Java").orElseGet(() -> skillRepository.save(new Skill("Java", "Backend")));
        Skill spring  = skillRepository.findByName("Spring Boot").orElseGet(() -> skillRepository.save(new Skill("Spring Boot", "Backend")));
        Skill react   = skillRepository.findByName("React").orElseGet(() -> skillRepository.save(new Skill("React", "Frontend")));
        Skill css     = skillRepository.findByName("CSS").orElseGet(() -> skillRepository.save(new Skill("CSS", "Frontend")));
        Skill mysql   = skillRepository.findByName("MySQL").orElseGet(() -> skillRepository.save(new Skill("MySQL", "Database")));
        Skill security= skillRepository.findByName("Security").orElseGet(() -> skillRepository.save(new Skill("Security", "Security")));
        Skill testing = skillRepository.findByName("Software Testing").orElseGet(() -> skillRepository.save(new Skill("Software Testing", "QA")));
        Skill devops  = skillRepository.findByName("Docker").orElseGet(() -> skillRepository.save(new Skill("Docker", "DevOps")));

        // ── 3. Seed Developers ─────────────────────────────────────────────
        if (developerRepository.count() == 0) {
            Developer devA = new Developer("Developer A", "deva@company.com", 4, 30.0, 45.0, 4.8);
            devA.setSkills(Set.of(java, mysql, spring));
            Developer devB = new Developer("Developer B", "devb@company.com", 3, 40.0, 40.0, 4.5);
            devB.setSkills(Set.of(react, css));
            Developer devC = new Developer("Developer C", "devc@company.com", 6, 20.0, 70.0, 4.9);
            devC.setSkills(Set.of(java, security, spring));
            Developer devD = new Developer("Developer D", "devd@company.com", 2, 50.0, 35.0, 4.2);
            devD.setSkills(Set.of(testing, devops));
            developerRepository.saveAll(List.of(devA, devB, devC, devD));
        }

        // ── 4. Seed Projects (correct budgets in INR) ──────────────────────
        Project p1 = getOrCreateProject("Enterprise E-Commerce Platform V2",
                "High-performance cloud-native software application migration and resource allocation",
                LocalDate.of(2026, 8, 17), LocalDate.of(2026, 9, 16), 1520000.0, 68, "In Progress");

        Project p2 = getOrCreateProject("Cloud Native Migration Project",
                "Enterprise microservices migration to AWS EKS cluster",
                LocalDate.of(2026, 9, 15), LocalDate.of(2026, 11, 30), 1680000.0, 35, "In Progress");

        Project p3 = getOrCreateProject("Student Portal System",
                "Mobile portal companion app and web backend",
                LocalDate.of(2026, 10, 9), LocalDate.of(2026, 11, 23), 1350000.0, 75, "In Progress");

        Project p4 = getOrCreateProject("HR Management Suite",
                "Automated payroll, attendance and employee SRE management",
                LocalDate.of(2026, 10, 9), LocalDate.of(2026, 10, 24), 1410000.0, 90, "Testing");

        // ── 5. Seed Tasks (distributed across all 4 projects) ─────────────
        if (taskRepository.count() == 0) {
            // --- Project 1: E-Commerce Platform ---
            Task loginTask = new Task("Login Module & JWT Auth", "Implement OAuth2 and JWT authentication", Task.TaskPriority.HIGH, 6, 3, p1);
            loginTask.setRequiredSkills(Set.of(java, mysql, security));
            Task uiTask = new Task("User Interface & Dashboard", "Develop responsive React dashboard and task management views", Task.TaskPriority.HIGH, 5, 5, p1);
            uiTask.setRequiredSkills(Set.of(react, css));
            Task paymentTask = new Task("Payment Gateway API", "Integrate Stripe and secure transaction webhook endpoints", Task.TaskPriority.VERY_HIGH, 9, 6, p1);
            paymentTask.setRequiredSkills(Set.of(java, security, spring));
            Task testingTask1 = new Task("System Integration Testing", "Automated E2E unit testing and regression suite", Task.TaskPriority.MEDIUM, 4, 4, p1);
            testingTask1.setRequiredSkills(Set.of(testing));
            Task devopsTask1 = new Task("Docker & Kubernetes Deployment", "Containerization and CI/CD pipeline deployment", Task.TaskPriority.CRITICAL, 7, 3, p1);
            devopsTask1.setRequiredSkills(Set.of(devops, spring));

            // --- Project 2: Cloud Native Migration ---
            Task k8sTask = new Task("Kubernetes Cluster Setup", "Deploy EKS cluster with node groups and autoscaling", Task.TaskPriority.HIGH, 8, 5, p2);
            k8sTask.setRequiredSkills(Set.of(devops));
            Task containerTask = new Task("Microservice Containerization", "Dockerize all Spring Boot services", Task.TaskPriority.HIGH, 7, 4, p2);
            containerTask.setRequiredSkills(Set.of(devops, spring));
            Task cicdTask = new Task("CI/CD Pipeline Configuration", "Jenkins and GitHub Actions integration setup", Task.TaskPriority.MEDIUM, 6, 3, p2);
            cicdTask.setRequiredSkills(Set.of(devops, java));

            // --- Project 3: Student Portal System ---
            Task authTask = new Task("Student Authentication Module", "SSO and student login with university ID", Task.TaskPriority.HIGH, 5, 3, p3);
            authTask.setRequiredSkills(Set.of(java, security));
            Task courseTask = new Task("Course Registration Portal", "Online course selection and registration UI", Task.TaskPriority.HIGH, 6, 5, p3);
            courseTask.setRequiredSkills(Set.of(react, css));
            Task attendanceTask = new Task("Attendance Tracking System", "QR-based attendance logging with mobile app", Task.TaskPriority.MEDIUM, 5, 4, p3);
            attendanceTask.setRequiredSkills(Set.of(java, mysql));

            // --- Project 4: HR Management Suite ---
            Task payrollTask = new Task("Payroll Processing Engine", "Automated salary calculation and tax deduction", Task.TaskPriority.CRITICAL, 9, 7, p4);
            payrollTask.setRequiredSkills(Set.of(java, mysql, spring));
            Task onboardingTask = new Task("Employee Onboarding Workflow", "Digital onboarding and document management", Task.TaskPriority.HIGH, 5, 4, p4);
            onboardingTask.setRequiredSkills(Set.of(react, css));
            Task reviewTask = new Task("Performance Review Module", "360-degree appraisal and rating system", Task.TaskPriority.MEDIUM, 4, 3, p4);
            reviewTask.setRequiredSkills(Set.of(java, testing));

            taskRepository.saveAll(List.of(
                loginTask, uiTask, paymentTask, testingTask1, devopsTask1,
                k8sTask, containerTask, cicdTask,
                authTask, courseTask, attendanceTask,
                payrollTask, onboardingTask, reviewTask
            ));

            // Task statuses
            loginTask.setStatus("NOT_STARTED");
            uiTask.setStatus("TESTING");
            paymentTask.setStatus("IN_PROGRESS");
            testingTask1.setStatus("NOT_STARTED");
            devopsTask1.setStatus("IN_PROGRESS");

            k8sTask.setStatus("IN_PROGRESS");
            containerTask.setStatus("IN_PROGRESS");
            cicdTask.setStatus("NOT_STARTED");

            authTask.setStatus("COMPLETED");
            courseTask.setStatus("IN_PROGRESS");
            attendanceTask.setStatus("TESTING");

            payrollTask.setStatus("COMPLETED");
            onboardingTask.setStatus("COMPLETED");
            reviewTask.setStatus("TESTING");

            // Task dependencies
            testingTask1.setDependencyTaskIds(Set.of(loginTask.getId(), paymentTask.getId()));
            devopsTask1.setDependencyTaskIds(Set.of(testingTask1.getId()));

            taskRepository.saveAll(List.of(
                loginTask, uiTask, paymentTask, testingTask1, devopsTask1,
                k8sTask, containerTask, cicdTask,
                authTask, courseTask, attendanceTask,
                payrollTask, onboardingTask, reviewTask
            ));
        }

        // ── 6. Seed Server Nodes ───────────────────────────────────────────
        if (serverNodeRepository.count() == 0) {
            ServerNode s1 = serverNodeRepository.save(new ServerNode("Server-1 (US-East)", 16, 64, 42.0, 55.0, 320, 24.5));
            ServerNode s2 = serverNodeRepository.save(new ServerNode("Server-2 (US-West)", 8, 32, 68.0, 70.0, 510, 48.0));
            ServerNode s3 = serverNodeRepository.save(new ServerNode("Server-3 (EU-Central)", 16, 64, 30.0, 40.0, 180, 18.2));
            ServerNode s4 = serverNodeRepository.save(new ServerNode("Server-4 (AP-South)", 8, 16, 85.0, 88.0, 620, 75.0));

            if (resourceAllocationRepository.count() == 0) {
                resourceAllocationRepository.save(new ResourceAllocation("Payment Gateway API", "HIGH", 8, 16, 22.0, s1, "HEURISTIC"));
                resourceAllocationRepository.save(new ResourceAllocation("User Login Module", "MEDIUM", 4, 8, 15.0, s2, "GENETIC_ALGORITHM"));
                resourceAllocationRepository.save(new ResourceAllocation("Product Search Engine", "MEDIUM", 4, 12, 18.0, s3, "Q_LEARNING"));
                resourceAllocationRepository.save(new ResourceAllocation("Report Generator", "LOW", 2, 4, 85.0, s4, "HEURISTIC"));
            }
        }

        System.out.println(">>> DataInitializerService completed: Initial sample datasets populated successfully!");
    }

    /**
     * Gets an existing project by name, or creates it if it doesn't exist.
     * Does NOT overwrite budgets of existing projects (preserves user edits).
     */
    private Project getOrCreateProject(String name, String description, LocalDate start, LocalDate deadline,
                                        double budget, int progress, String status) {
        return projectRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Project p = new Project(name, description, start, deadline, budget);
                    p.setProgress(progress);
                    p.setStatus(status);
                    return projectRepository.save(p);
                });
    }
}
