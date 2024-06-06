# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the local directory contents into the container at /usr/src/app
COPY . /usr/src/app

# Install gcc, g++, and cmake
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ cmake && \
    rm -rf /var/lib/apt/lists/*

# Install packages 
RUN pip install llama-cpp-python
RUN pip install 'llama-cpp-python[server]'

# Set environment variable for the host
ENV HOST=0.0.0.0
ENV PORT=8000

EXPOSE ${PORT}

# Define environment variable
ENV MODEL_DIR /usr/src/app/model/Meta-Llama-3-8B-Instruct-Q8_0.gguf

# Run server when the container launches
CMD ["python3", "-m", "llama_cpp.server", "--model", "model/Meta-Llama-3-8B-Instruct-Q8_0.gguf"]