## Build stage
#FROM maven:3.9.3-eclipse-temurin-17 AS build
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn -B -DskipTests package
#
## Run stage
#FROM eclipse-temurin:17-jre
#WORKDIR /app
#COPY --from=build /app/target/application-1.0.0.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java","-jar","/app/app.jar"]
#
#




# Build stage
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Set Spring Boot profile to prod
ENV SPRING_PROFILES_ACTIVE=prod

# Copy the built JAR from build stage
COPY --from=build /app/target/application-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
