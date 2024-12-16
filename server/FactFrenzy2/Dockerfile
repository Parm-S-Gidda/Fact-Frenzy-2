# Use an official OpenJDK runtime as a parent image
FROM openjdk:22-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the executable JAR into the container
COPY target/FactFrenzy2-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]