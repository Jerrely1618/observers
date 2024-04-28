# Use the official Jenkins image with LTS tag as our base image
FROM jenkins/jenkins:lts as jenkins

# Switching to root user to install additional tools
USER root

# Installing Node.js (use the specific version you need for Vercel CLI)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

RUN npm i -g vercel

# Switching back to the Jenkins user for security reasons
USER jenkins

# Expose ports for Jenkins web interface and agent connections
EXPOSE 8080
EXPOSE 50000
