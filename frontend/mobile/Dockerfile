FROM node:18-alpine

WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the default Expo ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the Expo development server
CMD ["npm", "start"]