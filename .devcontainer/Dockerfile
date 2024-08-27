FROM golang:1.23.0-alpine@sha256:d0b31558e6b3e4cc59f6011d79905835108c919143ebecc58f35965bf79948f4

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs


RUN \
	echo ">> Downloading required apk's..." && \
	apk --no-cache add gcc musl-dev

# Install pnpm globally
RUN npm install -g pnpm

# Install Go tools
RUN go install golang.org/x/tools/gopls@latest

# Install any additional tools or dependencies
RUN apt-get update && apt-get install -y \
    git \
    make

WORKDIR /workspace
