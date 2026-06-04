# Multi-stage build for Spring Boot backend
# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean install -DskipTests

# Stage 2: Runtime with JRE only
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/backend-*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
