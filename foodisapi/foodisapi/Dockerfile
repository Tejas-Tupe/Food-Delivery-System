# ==========================================
# Stage 1: Build the JAR file using Maven
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package the application
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Run the application in a lightweight JRE
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the packaged jar from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]