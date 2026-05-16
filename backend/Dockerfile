FROM node:22-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client (using local version)
RUN npm run prisma:generate

# Build the project
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
